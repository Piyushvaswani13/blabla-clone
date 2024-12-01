// MathUtils.ts
class MapUtils {
    
    static calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3; // meters (Earth's radius)
        const φ1 = MapUtils.toRadians(lat1);
        const φ2 = MapUtils.toRadians(lat2);
        const Δφ = φ2 - φ1;
        const λ1 = MapUtils.toRadians(lon1);
        const λ2 = MapUtils.toRadians(lon2);
        const Δλ = λ2 - λ1;
  
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
        return Math.round(R * c); // Distance in meters, round to nearest meter
      };
  
      static toRadians = (degrees) => degrees * Math.PI / 180;
  
   
  }
  
  // Exporting the class
  export default MapUtils;
  