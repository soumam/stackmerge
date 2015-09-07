define([
    'backbone',
    'underscore',
    'models/m.preview'
], function (
    Backbone,
    _,
    PreviewModel
) {
    var PreviewView = Backbone.View.extend({
        el: 'canvas.preview',
        model: new PreviewModel(),
        initialize: function (options) {
            this.images = options.images;
            this.listenTo(this.images, 'imagesLoaded remove change:visible', this.render);
        },
        render: function () {
            var outputCtx = this.el.getContext('2d');
            var visibleImages;
            var firstImage;

            if (this.images.length === 0) {
                return this;
            }

            visibleImages = this.images.getVisibleImages();

            if (visibleImages.length === 0) {
                return this;
            }

            firstImage = visibleImages[0].get('image');

            if (!firstImage) {
                return this;
            }

            this.el.width = firstImage.naturalWidth;
            this.el.height = firstImage.naturalHeight;
            this.$el.parent().addClass('working');

            this.images.getCombinedImageData(function (data) {
                this.$el.parent().removeClass('working');
                outputCtx.clearRect(0, 0, this.el.width, this.el.height);
                outputCtx.putImageData(data, 0, 0);
            }.bind(this));

            return this;
        }
    });

    return PreviewView;
});
