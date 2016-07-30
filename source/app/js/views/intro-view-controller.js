// Extends ViewControllerBase
var IntroViewController = function(config)
{
    // call base class constructor
    ViewControllerBase.call(this, config);

    // class level members
    this.stage;
    this.confettiController = {};
    this.timeline = {};

    // DOM elements
    this.scaler = this.elem.find(".scaler");
    this.cup = this.elem.find(".cup");
};
inheritsFrom(IntroViewController, ViewControllerBase);

// Intro View Implementation
$.extend(IntroViewController.prototype, {

	// ViewControllerBase overridden methods
    setup: function()
    {
        ViewControllerBase.prototype.setup.call(this);
    	var scope = this;

        // load the assets
        this.loader = new createjs.LoadQueue(true);
        this.listenerRefs["loader"] = this.loader.addEventListener("complete", function() { scope.handleLoadComplete(); });
        this.loader.loadManifest(this.config.assets);
    },

    transitionIn: function()
    {
        var scope = this;

        ViewControllerBase.prototype.transitionIn.call(this);

        this.timeline.to(this.cup, 1, { bottom:0, ease:Power2.easeOut });
        this.timeline.add(TweenMax.delayedCall(1, function() { scope.confettiController.initParticles(); } ));
        this.timeline.add(TweenMax.delayedCall(3, function() { scope.navigateTo("team-vs-team")} ));
    },

    // clean up - remove the confetti
    destroy: function()
    {
        console.log("destroy intro view");
        this.stage.removeChild(this.confettiController.container);
        this.confettiController = null;
        this.hide();
    },

    // Event Handlers
    handleLoadComplete: function()
    {
        var scope = this;

        // make a createJS stage for the confetti
        this.stage = new createjs.Stage($("#canvas")[0]);
		this.stage.update();
		this.stage.enableMouseOver();
		createjs.Ticker.setFPS(app.siteModel.properties.fps);
		createjs.Ticker.addEventListener("tick", this.stage);
		createjs.Touch.enable(this.stage);

        // main timeline
        this.timeline = new TimelineMax({ onComplete:function() { } });

        // create the confetti
        this.confettiController = new ConfettiController(this.loader, "confetti-", app.siteModel.properties.width, app.siteModel.properties.height, {x:0, y:0}, 600, 1);
        this.stage.addChild(this.confettiController.container);

        // dom event handlers
        $(window).bind('resize', function (event) { scope.handleResize(event); });
        this.handleResize(null);

        // page is ready
        this.dispatchIsReady();
    },

    handleResize: function(event)
    {
        var newHeight = getBrowserHeight();
        var ratioH = newHeight / app.siteModel.properties.height;

        var newWidth = getBrowserWidth();
        var ratioW = newWidth / app.siteModel.properties.width;

        var ratio = Math.min(Math.min(ratioH, ratioW), 1);
        this.scaler.css("transform", "scale(" + ratio + ")");
    }
});
