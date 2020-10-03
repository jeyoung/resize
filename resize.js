var ResizeJS = ResizeJS || (function () {

    function ResizerService() {
    }

    ResizerService.prototype.resize = function (file, callback) {
        var fr = new FileReader();
        fr.onload = function (e) {
            var originalImage = document.createElement("img");
            originalImage.onload = function () {
                var maximumDimension = findMaximumDimension(originalImage.height, originalImage.width);

                var canvas = document.createElement("canvas");
                canvas.height = canvas.width = maximumDimension;

                var position = {x: (maximumDimension-originalImage.width)*0.5, y: (maximumDimension-originalImage.height)*0.5};

                var context = canvas.getContext("2d");
                context.fillStyle = "#000000";
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.drawImage(originalImage, position.x, position.y);

                var resizedImage = document.createElement("img");
                resizedImage.src = canvas.toDataURL("image/png");

                callback({original: originalImage, resized: resizedImage});
            };
            originalImage.src = e.target.result;
        };
        fr.readAsDataURL(file);
    };

    function findMaximumDimension(height, width) {
        return Math.max(height, width);
    }

    function ResizerController(view, resizerService) {
        this.view = view;
        this.resizerService = resizerService;
    }

    ResizerController.prototype.initialise = function () {
        this.view.show();
    };
    ResizerController.prototype.go = function () {
        var that = this;
        this.resizerService.resize(this.view.getImageFile(), function (images) {
            that.view.showResizedImage(images.resized);
        });
    };

    return { ResizerService: ResizerService, ResizerController: ResizerController };

})();


