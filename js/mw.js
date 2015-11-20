var mw = {
	beginGame: function () {
		var that = this;
		that.players[0].summonPoints = 10;
		that.players[1].summonPoints = 10;
		that.intervals.gameBegin = window.setInterval(function () {
			that.action.addSummonPoints(1,2);
			that.action.addSummonPoints(2,2);
		}, 500);
	},
	createHandlers: (function () {
		var that = this;
		$(document).keydown(function (eve) {
			var which = eve.which;
			console.log(which);
			switch (which) {
				case 90: eve.preventDefault(); mw.beginGame(); break;
				case 39: eve.preventDefault(); mw.createHandlers.rightPress(2); break;
				case 37: eve.preventDefault(); mw.createHandlers.leftPress(2); break;
				case 40: eve.preventDefault(); mw.createHandlers.downPress(2); break;
				case 38: eve.preventDefault(); mw.createHandlers.upPress(2); break;
				case 13: eve.preventDefault(); mw.createHandlers.enterPress(2); break;
				case 68: eve.preventDefault(); mw.createHandlers.rightPress(1); break;
				case 65: eve.preventDefault(); mw.createHandlers.leftPress(1); break;
				case 83: eve.preventDefault(); mw.createHandlers.downPress(1); break;
				case 87: eve.preventDefault(); mw.createHandlers.upPress(1); break;
				case 32: eve.preventDefault(); mw.createHandlers.enterPress(1); break;
			}
		});
		return {
			leftPress: function (player) {
				var cache = $("#p" + player + "unitMaker");
				cache.find(".active").removeClass("active").prev().addClass("active");
				if (cache.find(".active")[0] === undefined) {
					cache.find(".last").addClass("active");
				}
			},
			rightPress: function (player) {
				var cache = $("#p" + player + "unitMaker");
				cache.find(".active").removeClass("active").next().addClass("active");
				if (cache.find(".active")[0] === undefined) {
					cache.find(".first").addClass("active");
				}
			},
			downPress: function (player) {
				var cache = $("#activeline" + player);
				if (cache.css("top") === "398px") {
					cache.css("top", "48px");
				} else {
					cache.css("top","+=50");
				}
			},
			upPress: function (player) {
				var cache = $("#activeline" + player);
				if (cache.css("top") === "48px") {
					cache.css("top", "398px");
				} else {
					cache.css("top","-=50");
				}
			},
			enterPress: function (player) {
				var unit = $("#p" + player + "unitMaker .active").attr("id").split("_")[1];
				var position = $("#activeline" + player).css("top");
				switch (position) {
					case "48px": mw.action.createUnit(unit, player, 1); break;
					case "98px": mw.action.createUnit(unit, player, 2);  break;
					case "148px": mw.action.createUnit(unit, player, 3);  break;
					case "198px": mw.action.createUnit(unit, player, 4);  break;
					case "248px": mw.action.createUnit(unit, player, 5);  break;
					case "298px": mw.action.createUnit(unit, player, 6);  break;
					case "348px": mw.action.createUnit(unit, player, 7);  break;
					case "398px": mw.action.createUnit(unit, player, 8);  break;
				}
			}
		}
	} ()),
	util: {
		createRandomString: function (string_length, hash) {
			var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
			var randomstring = hash;
			var i;
			for (i = 0; i < string_length; i += 1) {
				var rnum = Math.floor(Math.random() * chars.length);
				randomstring += chars.substring(rnum,rnum+1);
			}
			return randomstring;
		}
	},
	storage: {},
	action: {
		addSummonPoints: function (player, pts) {
			mw.players[player-1].summonPoints += pts;
			$("#p" + player + "sp").text(mw.players[player-1].summonPoints);
		},
		subSummonPoints: function (player, pts) {
			mw.players[player-1].summonPoints -= pts;
			$("#p" + player + "sp").text(mw.players[player-1].summonPoints);
		}
	},
	intervals: {},
	players: [{
		score: 0,
		summonPoints: 0
	},{
		score: 0,
		summonPoints: 0
	}],
	endGame: function (total) {
		var that = this;
		window.clearInterval(that.intervals.gameBegin);
		that.players[0].summonPoints = 0;
		that.players[1].summonPoints = 0;
		if (total === 10) {
			$(".winner").text("Player 1 wins!");
		} else {
			$(".winner").text("Player 2 wins!");
		}
		$("#gameOver").show();
	}
};

mw.util.createRandomString = function (string_length, hash) {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var randomstring = hash;
	var i;
	for (i = 0; i < string_length; i += 1) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	return randomstring;
};