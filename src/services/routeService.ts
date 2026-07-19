interface RouteResponse {
  distance: number;
  duration: number;
  geometry: [number, number][];
}

interface RouteCache {
  [key: string]: {
    data: RouteResponse;
    timestamp: number;
  };
}

const routeCache: RouteCache = {};
const CACHE_DURATION = 1000 * 60 * 60;

export const routeService = {
  async getRoute(
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number
  ): Promise<RouteResponse | null> {
    const cacheKey = `${startLat},${startLng}-${endLat},${endLng}`;

    if (routeCache[cacheKey] && Date.now() - routeCache[cacheKey].timestamp < CACHE_DURATION) {
      return routeCache[cacheKey].data;
    }

    const apiKey = import.meta.env.VITE_OPENROUTESERVICE_API_KEY;

    if (!apiKey || apiKey === 'your_openrouteservice_api_key_here') {
      console.warn('OpenRouteService API key not configured, using fallback');
      return null;
    }

    try {
      const response = await fetch(
        'https://api.openrouteservice.org/v2/directions/driving-car',
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
            'Authorization': apiKey,
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: JSON.stringify({
            coordinates: [
              [startLng, startLat],
              [endLng, endLat]
            ],
            radiuses: [-1, -1]
          })
        }
      );

      if (!response.ok) {
        console.error('OpenRouteService API error:', response.statusText);
        return null;
      }

      const data = await response.json();

      if (!data.routes || data.routes.length === 0) {
        return null;
      }

      const route = data.routes[0];
      const geometry = route.geometry.coordinates.map((coord: number[]) => [
        coord[1],
        coord[0]
      ] as [number, number]);

      const result: RouteResponse = {
        distance: route.summary.distance / 1000,
        duration: route.summary.duration / 60,
        geometry
      };

      routeCache[cacheKey] = {
        data: result,
        timestamp: Date.now()
      };

      return result;
    } catch (error) {
      console.error('Error fetching route from OpenRouteService:', error);
      return null;
    }
  },

  calculateEstimatedTime(distanceKm: number): number {
    const avgSpeedKmh = 30;
    return Math.round(distanceKm / avgSpeedKmh * 60);
  }
};
