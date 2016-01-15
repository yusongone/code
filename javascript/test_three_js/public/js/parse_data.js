/**
 * Created by yusong on 15/7/9.
 */
var Page=window.Page||{};



(function(){
    function _unproject  (point) { // (Point, Boolean) -> LatLng
        var RAD_TO_DEG = 180 / Math.PI,
            MAX_LATITUDE = 85.0840591556,
            R_MINOR = 6356752.314245179,
            R_MAJOR = 6378137;

        var d = RAD_TO_DEG,
            r = R_MAJOR,
            r2 = R_MINOR,
            lng = point.x * d / r,
            tmp = r2 / r,
            eccent = Math.sqrt(1 - (tmp * tmp)),
            ts = Math.exp(- point.y / r),
            phi = (Math.PI / 2) - 2 * Math.atan(ts),
            numIter = 15,
            tol = 1e-7,
            i = numIter,
            dphi = 0.1,
            con;

        while ((Math.abs(dphi) > tol) && (--i > 0)) {
            con = eccent * Math.sin(phi);
            dphi = (Math.PI / 2) - 2 * Math.atan(ts *
                    Math.pow((1.0 - con) / (1.0 + con), 0.5 * eccent)) - phi;
            phi += dphi;
        }
        var latlng={
            lat:phi*d,
            lng:lng
        };
        return latlng;
    }

    function _project (latlng) { // (LatLng) -> Point
        var RAD_TO_DEG = 180 / Math.PI,
            MAX_LATITUDE = 85.0840591556,
            DEG_TO_RAD= Math.PI / 180,
            R_MINOR = 6356752.314245179,
            R_MAJOR = 6378137;

        var d = DEG_TO_RAD,
            max = MAX_LATITUDE,
            lat = Math.max(Math.min(max, latlng.lat), -max),
            r = R_MAJOR,
            r2 = R_MINOR,
            x = latlng.lng * d * r,
            y = lat * d,
            tmp = r2 / r,
            eccent = Math.sqrt(1.0 - tmp * tmp),
            con = eccent * Math.sin(y);

        con = Math.pow((1 - con) / (1 + con), eccent * 0.5);

        var ts = Math.tan(0.5 * ((Math.PI * 0.5) - y)) / con;
        y = -r * Math.log(ts);
        var point={
            x:x,
            y:y
        }
        return point;
    };

   Page.Parse={
        getLatlng:function(point){
          return _unproject(point)
        },
        getPoint:function(latlng){
           return _project(latlng)
        }
   }
})();
