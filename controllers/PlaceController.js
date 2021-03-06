const path = require("path");
const fs = require("fs");

exports.postAPIPixel = (req, res, next) => {
    if (fs.existsSync(path.join(__dirname, "../util/", "legit.js"))) {
        if (!req.pass) return res.status(403).json({ success: false, error: { message: "You cannot do that.", code: "unauthorized" } });
    }
    function paintWithUser(user) {
        if (!req.body.pixels) return res.status(400).json({ success: false, error: { message: "You need to include all paramaters", code: "invalid_parameters" } })
        req.body.pixels.map((pixel) => {
            if (!pixel.x || !pixel.y || !pixel.hex) return res.status(400).json({ success: false, error: { message: "You need to include all paramaters", code: "invalid_parameters" } });
            var x = Number.parseInt(rpixel.x), y = Number.parseInt(pixel.y);
            if(Number.isNaN(x) || Number.isNaN(y)) return res.status(400).json({ success: false, error: { message: "Your coordinates were incorrectly formatted", code: "invalid_parameters" } });
            if (!req.place.colours.includes(pixel.hex.toUpperCase())) return res.status(400).json({ success: false, error: { message: "You can't place that colour.", code: "disallowed_colour" } });
            var rgb = req.place.paintingManager.getColourRGB(pixel.hex);
            req.place.paintingManager.doPaint(rgb, x, y, user).then((pixel) => {
                res.json({ success: true });
            }).catch((err) => {
                req.place.logger.capture(`Error placing pixel: ${err.message}`, { user: user });
                res.status(500).json({ success: false, error: err })
            });
        })
    }
    paintWithUser(req.user);
};

exports.getAPITimer = (req, res, next) => {
    function getTimerPayload(user) {
        var seconds = user.getPlaceSecondsRemaining(req.place);
        var countData = { canPlace: seconds <= 0, seconds: seconds };
        return { success: true, timer: countData };
    }
    return res.json(getTimerPayload(req.user));
};
