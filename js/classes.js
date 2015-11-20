(function () {

	var classes = {
		warrior: function () {
			return {
				name: "warrior",
				health: 15,
				attack: 5,
				defense: 6,
				speed: 3,
				range: 5,
				frequency: 5,
				cost: 15,
				type: "sword"
			};
		},
		peasant: function () {
			return { 
				name: "peasant",
				health: 9,
				attack: 3,
				defense: 4,
				speed: 5,
				range: 4,
				frequency: 5,
				cost: 10,
				type: "hand"
			};
		},
		mage: function () {
			return {
				name: "mage",
				health: 9,
				attack: 40,
				defense: 2.5,
				speed: 2,
				range: 30,
				frequency: 10,
				cost: 15,
				type: "range"
			};
		},
		archer: function () {
			return {
				name: "archer",
				health: 12,
				attack: .5,
				defense: 5,
				speed: 3,
				range: 40,
				frequency: 5,
				cost: 15,
				type: "range"
			};
		},
		scout: function () {
			return {
				name: "scout",
				health: 2,
				attack: 1,
				defense: 2,
				speed: 15,
				range: 0,
				frequency: 5,
				cost: 4,
				type: "range",
				canAttack: false
			};
		},
		axeman: function () {
			return {
				name: "axeman",
				health: 17,
				attack: 60,
				defense: 7,
				speed: 3,
				range: 10,
				frequency: 10,
				cost: 30,
				type: "range"
			};
		}
	};
	mw.storage.classes = classes;
} ());


(function () {
	calculate = function (name) {
		var unit = mw.storage.classes[name]();
		var h, a, d, f, r;
		h = unit.health;
		a = unit.attack;
		d = unit.defense;
		f = (11 - unit.frequency);
		r = unit.range;
		return Math.round(((h*Math.pow(a,2) + Math.pow(a,2)*d + Math.pow(f,1.4)*h + Math.pow(f,1.4)*d) + Math.pow(1.5,r)/5000)/18);
	};
	console.log("warrior: " + calculate("warrior"));
	console.log("peasant: " + calculate("peasant"));
	console.log("mage: " + calculate("mage"));
	console.log("archer: " + calculate("archer"));
	console.log("scout: " + calculate("scout"));
	console.log("axeman: " + calculate("axeman"));
} ());

(function () {
	var units = {};
	mw.action.createUnit = function ($class, player, row) {
		var name = mw.util.createRandomString(10, "a"),
			unitCheck = mw.storage.classes[$class](),
			health = unitCheck.health;
		if (unitCheck.cost <= mw.players[player-1].summonPoints) {
			units[name] = unitCheck;
			$.extend( units[name], {
				health: health,
				name: name,
				row: row,
				$class: $class,
				position: 0,
				player: player,
				isAttacking: false,
				isScoring: false,
				move: function (num) {
					var that = this,
						i = 0,
						leftRight, oneTwo;
					if (that.player === 1) {
						leftRight = {
							left: '+=' + num
						};
						oneTwo = 2;
					} else {
						leftRight = {
							right: '+=' + num
						};
						oneTwo = 1;
					}
					that.element.animate(leftRight, {
						duration: 60000 / that.speed,
						easing: "linear",
						step: function () {
							var collision = $(this).collision(".p" + oneTwo),
								secondCollision = $(this).children().collision(".scoreline");
							if (collision[0] !== undefined ) {
								$(this).stop();
							}
							if (collision[0] !== undefined && that.isAttacking === false) {
								that.isAttacking = true;
								that.initAttack($(this), $(collision[0]).parent());
							} else if (secondCollision[0] !== undefined) {
								that.score($(this));
							}
						}
					});
				},
				initAttack: function ($this, defender) {
					var that = this, units = mw.storage.units, 
					attack = that.attack,
					tDefender = units[defender.attr("id")],
					defense = tDefender.defense,
					health = tDefender.health,
					damage = 1, 
					newHealth, defendPoints;
					damage = attack / (defense * 5 + .0000001) + 1; //.0000001 in case defense somehow is zero
					if (that.canAttack === false) {
						damage = 0;
					}
					newHealth = health - damage;
					if (newHealth < 1) {
						defendPoints = Math.floor(tDefender.cost / 4);
						mw.action.addSummonPoints(that.player, defendPoints);
						defender.stop().remove();
						that.isAttacking = false;
						window.clearInterval(mw.intervals[that.name]);
						window.clearInterval(mw.intervals[tDefender.name]);
						delete mw.intervals[that.name];
						delete mw.intervals[tDefender.name]
						that.move(800);
					} else {
						tDefender.health = newHealth;
						if (mw.intervals[that.name] === undefined) {
							mw.intervals[that.name] = window.setInterval (function () {
								that.initAttack($this, defender);
							}, that.frequency*100);
						}
					}
				},
				score: function ($this) {
					var that = this,
						total;
					if (that.isScoring === false) {
						that.isScoring = true;
						$this.remove();
						mw.players[that.player - 1].score += 1;
						delete mw.storage.units[that.name];
						total = mw.players[0].score - mw.players[1].score;
						if (total === 15 || total === -15) {
							mw.endGame(total);
						} else {
							$("#p2vp").text(-total);
							$("#p1vp").text(total);
						}
					}
				}
			});

			if (player === 1) {
				units[name].element = $('<div class="unit u1" id="' + name + '" style="padding-right: ' + units[name].range * 5 + 'px; left: 10px; top: ' + (50 * row) + 'px;"><div id="sub_' + name + '" class="p1 innerUnit">' + $class + '</div></div>').appendTo("#field");
			} else {
				units[name].element = $('<div class="unit u2" id="' + name + '" style="padding-left: ' + units[name].range * 5 + 'px;right: 10px; top: ' + (50 * row) + 'px;"><div id="sub_' + name + '" class="p2 innerUnit">' + $class + '</div></div>').appendTo("#field");
			}
			mw.action.subSummonPoints(player, units[name].cost);
			units[name].move(1000);
		}
		return false;
	};

	mw.storage.units = units;

} ());

$(function () {
	$(".u1unit, .u2unit").each(function () {
		var id = $(this).attr("id").split("_")[1];
		var unit = mw.storage.classes[id]();
		$(this).html(id + "<br />" + unit.cost + "pt");
	})
})