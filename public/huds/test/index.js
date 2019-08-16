var teams = {
    left: {},
    right: {}
}
var start_money = {};

function fillObserved(player) {
    let statistics = player.getStats();
    let weapons = player.weapons;
    let right = false;

    if (player.observer_slot >= 1 && player.observer_slot <= 5) {
        right = true;
    }
    let flag = player.country_code || (right
        ? (teams.left.flag || "")
        : (teams.right.flag || ""));
    

    $("#kills_count").html(" K: " + statistics.kills);
    $("#assist_count").html(" A: " + statistics.assists);
    $("#death_count").html(" D: " + statistics.deaths);
    $("#player-container")
        .removeClass("t ct")
        .addClass(player.team.toLowerCase());

    $("#current_nick").html(player.name);
    $("#nick_also").html(player.real_name + " ");
    $("#nades").html("");
    $("#player-container").find("#bomb_ct").html(statistics.defusekit ? $("<img />").attr("src", "/files/img/elements/defuse.png").addClass("invert_brightness") : "");

    if (statistics.health <= 20) {
        $("#player-container").find("#health-text").removeClass("low_health").addClass("low_health");
    } else {
        $("#player-container").find("#health-text").removeClass("low_health");
    }

    for (let key in weapons) {
        let weapon = weapons[key];
        if (weapon.type == "Grenade") {
            for (let x = 0; x < weapon.ammo_reserve; x++) {
                $("#nades").append($("<img />").attr("src", "/files/img/grenades/" + weapon.name + ".png"));
            }
        }
        if (weapon.state == "active" || weapon.state == "reloading") {
            if (weapon.type == "Grenade" || weapon.type == "C4" || weapon.type == "Knife" || statistics.health == 0) {

                $(".clip").html("");
                $(".reserve").html("");
            } else {
                $(".clip").html(weapon.ammo_clip + "/");
                $(".reserve").html(weapon.ammo_reserve);
            }
        }
    }
    $("#armor-text").html(statistics.armor);
    $("#health-text").html(statistics.health);
    $("#armor-text")
        .removeClass("armor helmet")
        .addClass(statistics.helmet
            ? "helmet"
            : "armor");
    loadAvatar(player.steamid, function(){
        $("#avatar_container").html($("<img />").attr("src", "/av/"+player.steamid));
    });
}

function fillPlayers(teams){
    if(teams.left.players){
        for(var i = 0; i < 5; i++){
            if(i >=teams.left.players.length){
                $("#left").find("#player"+(i+1)).css("opacity", "0");
            } else{
                fillPlayer(teams.left.players[i],i, "left", teams.left.players.length);
                $("#left").find("#player"+(i+1)).css("opacity","1");
            }
        }
    }
    if(teams.right.players){
        for(var i = 0; i < 5; i++){
            if(i >=teams.right.players.length){
                $("#right").find("#player"+(i+1)).css("opacity","0");
            } else{
                fillPlayer(teams.right.players[i],i, "right", teams.right.players.length);
                $("#right").find("#player"+(i+1)).css("opacity","1");
            }
        }
    }
}
function fillPlayer(player,nr, side, max){
    let slot = player.observer_slot;
    let statistics = player.getStats();
    let weapons = player.getWeapons();
    let steamid = player.steamid;
    var money = player.getStats().money;
    let team = player.team.toLowerCase();

    let health_color = statistics.health <= 20 ? "#ff0000" : team == "ct" ? "#00a0ff":"#ffa000";

    let $player = $("#"+side).find("#player"+(nr+1));

    let $bottom = $player.find(".bottom_bar");
    let $top = $player.find(".bar1");

    let gradient = "linear-gradient(to " + side +", rgba(0,0,0,0) " + (100-statistics.health) + "%, " + health_color + " " + (100-statistics.health) + "%)";

    $top.find("#bar_username").text(player.name.split(" ").join(""));
    $top.find("#bar_username").removeClass("dead").addClass(statistics.health == 0 ? "dead" : "");
    $top.find("#weapon_icon").removeClass("money_left").addClass(statistics.health == 0 ? "money_left" : "");

    $top.find(".hp_bar").find(".money_left").html("$"+statistics.money);

    $("#hp_p").find(".hp_bar").css("background", gradient);

    $player.removeClass("dead_bg").addClass(statistics.health == 0 ? "dead_bg" : "");
    $player.find("#hp_p").removeClass("low_health").addClass(statistics.health <= 20 ? "low_health" : "");

    $top.find("#hp_p").text(statistics.health);
    $top.find(".hp_bar").css("background", gradient);

    $bottom.find(".kills").text(statistics.kills);
    $bottom.find(".assists").text(statistics.assists);
    $bottom.find(".deaths").text(statistics.deaths);

    $bottom.find(".hp_el").html(statistics.helmet ? $("<img />").attr("src", "/files/img/helmet.png") : statistics.armor > 0 ? $("<img />").attr("src", "/files/img/armor.png") : "");
    $bottom.find(".bomb_defuse").html(statistics.defusekit ? $("<img />").attr("src", "/files/img/elements/defuse.png").addClass("invert_brightness") : "");

    $player.find(".money_wrapper").html("$"+statistics.money);
    $player.find(".stats_wrapper").html("<table><tr><td>K</td><td>A</td><td>D</td></tr><tr><td>"+statistics.kills+"</td><td>"+statistics.assists+"</td><td>"+statistics.deaths+"</td></tr></table>");

    $player.find(".money_wrapper").removeClass("low").addClass(statistics.money < 1000? "low":"");
    
    if(statistics.health != 0) {
        $top.find("#weapon_icon").html("");
    }

    $bottom.find("#weapon_icon").html("");

    if(statistics.round_kills > 0){
        let img_css = {
            "text-shadow":"0 0 10px black",
            "float": side
        };

        if($player.find(".round_kills_count").text() != statistics.round_kills) {
            if($player.find(".round_kills_count").text() > statistics.round_kills) {
                $player.find(".round_kills_count").text();
                $player.find(".round_kills_container").html();
            } else if($player.find(".round_kills_count").text() < statistics.round_kills) {
                if($player.find(".round_kills_count").text() == 0 || $player.find(".round_kills_count").text() == "" || $player.find(".round_kills_count").text() == null) {
                    $player.find(".round_kills_container").animate({
                        width: 24
                    },150);
                }
                var rrmax = statistics.round_kills - $player.find(".round_kills_count").text();
                var rri = 0;
                $player.find(".round_kills_count").text(statistics.round_kills);
                while(rri < rrmax) {
                    $player.find(".round_kills_container").append("<div class='akill'></div>");
                    rri++;
                }
            }
        }
    }

    for(let key in weapons){
        let weapon = weapons[key];
        let name = weapon.name.replace("weapon_", "");
        let state = weapon.state;
        let view = "";
        let type = weapon.type;

        if(type != "C4" && type != "Knife"){
            view += weapon.state == "active" ? "checked" : "";
            if(type == "Grenade"){
                for(let x = 0; x < weapon.ammo_reserve; x++){
                    $bottom.find("#weapon_icon").append($("<img />").attr("src", "/files/img/grenades/weapon_" + name + ".png").addClass("invert").addClass(view));
                }
            } else if(type) {
                view += side == "right" ? " img-hor" : "";
                if (type == "Pistol") {
                    $bottom.find("#weapon_icon").prepend($("<img />").attr("src", "/files/img/weapons/" + name + ".png").addClass("invert").addClass(view));
                } else {
                    $top.find("#weapon_icon").prepend($("<img />").attr("src", "/files/img/weapons/" + name + ".png").addClass("invert").addClass(view));
                }
            }
        }
        if(type == "C4"){
            $bottom.find(".bomb_defuse").html($("<img />").attr("src", "/files/img/elements/bomb.png").addClass("invert_brightness bomb_t"));
        }
    }
    
    if (!start_money[steamid]) {
        start_money[steamid] = statistics.money;
    } 
    $("#stats_player"+slot).find("#stat_money").html("-"+(start_money[steamid]-statistics.money)+"$");
}
var isDefusing = false;


var bomb_time,
    bomb_timer,
    bomb_timer_css;
bomb_time = 0;
function bomb(time) {
    if (Math.pow((time - bomb_time), 2) > 1) {
        clearInterval(bomb_timer);
        bomb_time = parseFloat(time);
        if (bomb_time > 0) {
            bomb_timer = setInterval(function () {
                bomb_timer_css = {
                    display: "block",
                    width: bomb_time * 100 / 40 + "%"
                }
                $("#bomb_timer").css(bomb_timer_css);
                bomb_time = bomb_time - 0.01;
            }, 10);
        } else {
            clearInterval(bomb_timer);
        }
    }
}
function resetBomb() {
    clearInterval(bomb_timer);
    $("#bomb_timer").css("display", "none");
}

var menu = false;
var freezetime = false;
let last_round = 0;
var longd = 10;

function updatePage(data) {
    var observed = data.getObserved();
    var phase = data.phase();
    var team_one = data.getTeamOne();
    var team_two = data.getTeamTwo();

    // console.log(observed.real_name);
    // console.log(observed.teamData.short_name);

    if(observed.teamData) {
        $("#player-container").find("#team_name").html(observed.teamData.short_name + "<span style='margin: 0px 10px;'>|</span>" + observed.real_name);
        $('#player-container').find("#teambg-container").css({
            backgroundImage: "url(/teams/"+observed.teamData.logo + ")"
        });
    }
    
    var matchup = data.getMatchType();
    var match = data.getMatch();

    if(matchup && matchup.toLowerCase() != "none"){
        var block = $("<div class='block'></div>");
        var left_bl = $("<div></div>");
        var right_bl = $("<div></div>");

        for(var x = 0; x < (matchup == "bo5" ? 3 : 2); x ++){
            block.clone().appendTo($(left_bl)).addClass(match.team_1.map_score > x ? "win" : "");
            block.clone().appendTo(right_bl).addClass(match.team_2.map_score > x ? "win" : "");
        }
        $("#match_one_info").html(left_bl);
        $("#match_two_info").html(right_bl);
        
        $("#match_tournament").show();
        $("#match_info").text("Best Of " + matchup.substr(2));
    } else {
        $("#match_tournament").hide();
    }

    if (observed.steamid == 1 || !observed) {
        $("#player-container").css("opacity", "0");
    } else if (observed) {
        menu = (data.info.player.activity == "menu");
        $("#player-container").css("opacity", !menu ? "1" : "0");
    }

    let left,
        right;
    var players = data.getPlayers();
    var round = data.round();
    var map = data.map();
    var matchup = data.getMatchType();

    var round_now = map.round + (round.phase == "over" || round.phase == "intermission"
        ? 0
        : 1);
    if ((round.phase == "freezetime" && !freezetime) || round_now != last_round) {
        start_money = {};
        $(".round_kills_count").text(0);
        $(".round_kills_container .akill").remove();
        $(".round_kills_container").css({
            width: 0
        });
        $(".player_money_count").animate({
            width: 150
        },150);
    }

    var team_ct = data.getCT();
    var team_t = data.getT();
    var test_player2 = data.getPlayer(1);
    var tscore = [];
    $("body").css("display", !map || menu
        ? "none"
        : "block");
    if (test_player2) {
        left = test_player2
            .team
            .toLowerCase() == "ct"
            ? team_ct
            : team_t;
        right = test_player2
            .team
            .toLowerCase() != "ct"
            ? team_ct
            : team_t;
        
        teams.left.side = left.side || null;
        teams.right.side = right.side || null;

        teams.left.name = team_one.team_name || left.name;
        teams.right.name = team_two.team_name || right.name;

        if(teams.left.score !== undefined && teams.right.score !== undefined){
            if(left.score > teams.left.score){
                $("#winning_team").text(teams.left.name).removeClass("t-color ct-color").addClass(teams.left.side.toLowerCase() + "-color");
                $("#winning_team_logo").css({
                    backgroundImage: "url(/teams/"+teams.left.logo + ")"
                });
                $("#who_won").fadeTo(1000, 1).delay(2000).fadeTo(1000, 0);
            } else if(right.score > teams.right.score){
                $("#winning_team").text(teams.right.name).removeClass("t-color ct-color").addClass(teams.right.side.toLowerCase() + "-color");
                $("#winning_team_logo").css({
                    backgroundImage: "url(/teams/"+teams.right.logo + ")"
                });
                $("#who_won").fadeTo(1000, 1).delay(2000).fadeTo(1000, 0);
            }
        }

        teams.left.score = left.score;
        teams.right.score = right.score;

        teams.left.flag = team_one.country_code || null;
        teams.right.flag = team_two.country_code || null;

        teams.left.logo = team_one.logo || null;
        teams.right.logo = team_two.logo || null;

        teams.left.map_score = team_one.map_score || 0;
        teams.right.map_score = team_two.map_score || 0;


        teams.left.players = left.players || null;
        teams.right.players = right.players || null;

        $("#match_one_info")
            .removeClass("ct t")
            .addClass(test_player2.team.toLowerCase());
        $("#match_two_info")
            .removeClass("ct t")
            .addClass(test_player2.team.toLowerCase() != "ct"
                ? "ct"
                : "t");

        $("#team_1")
            .removeClass("ct-color t-color")
            .addClass(test_player2.team.toLowerCase() + "-color");
        $("#team_2")
            .removeClass("ct-color t-color")
            .addClass(test_player2.team.toLowerCase() != "t"
                ? "t-color"
                : "ct-color");

        $("#left")
            .find("#team_money_1").removeClass('low').addClass(left.team_money < 1000 ? "low":"")
            .text("$" + left.team_money);
        $("#left")
            .find("#eq_money_1")
            .text("$" + left.equip_value);

        $("#right")
            .find("#team_money_2").removeClass('low').addClass(right.team_money < 1000 ? "low":"")
            .text("$" + right.team_money);
        $("#right")
            .find("#eq_money_2")
            .text("$" + right.equip_value);
    }

    $("#round_counter").html("Round " + round_now + " / 30");
    $("#matchup .content").html(matchup);
    if(matchup == "bo3") {
        $('#matchup .leftscore, #matchup .rightscore').html('<div class="matchupscore"></div><div class="matchupscore"></div>');
    }

    if(match.team_1.map_score > 0) {
        $('#matchup .leftscore .matchupscore:nth-child(' + match.team_1.map_score + ')').addClass("active");
    }
    
    if(match.team_2.map_score > 0) {
        $('#matchup .rightscore .matchupscore:nth-child(' + match.team_2.map_score + ')').addClass("active");
    }

    $("#team_2 #team_name").html(teams.right.name);
    $("#team_2 #team_score").html(teams.right.score);
    $("#team_1 #team_name").html(teams.left.name);
    $("#team_1 #team_score").html(teams.left.score);
    if (teams.left.logo || teams.left.flag) {
        if (teams.left.flag) {
            $("#team_1 #team_logo #team_flag").css("background-image", "url('/files/img/flags/" + teams.left.flag + ".png')");
        }
        if (teams.left.logo) {
            $("#team_1_logo").attr("src", "/teams/"+teams.left.logo);
            $("#team_1 #team_logo").removeClass("empty");
        }
    } else {
        $("#team_1 #team_logo #team_flag").css("background-image", "");
        $("#team_1 #team_logo").addClass("empty");
    }
    if (teams.right.logo || teams.right.flag) {
        if (teams.right.flag) {
            $("#team_2 #team_logo #team_flag").css("background-image", "url('/files/img/flags/" + teams.right.flag + ".png')");
        }
        if (teams.right.logo) {
            $("#team_2_logo").attr("src", "/teams/"+teams.right.logo);
            $("#team_2 #team_logo").removeClass("empty");
        }
    } else {
        $("#team_2 #team_logo").addClass("empty");
        $("#team_2 #team_logo #team_flag").css("background-image", "");
    }

    //OBSERVED PLAYER
    if (observed && observed.steamid != 1 && observed.getStats()) {
        fillObserved(observed);
    }

    //EVERY OTHER PLAYER
    if (players) {
        
        var offset = 0;
        for (var sl in players) {
            let player = players[sl];
            if (avatars[player.steamid] != true && disp_avatars) 
                loadAvatar(player.steamid);
            
            if(player.observer_slot <= 5 && offset == 0 && player.team.toLowerCase() != teams.left.side)
                offset = 6 - sl;
        }
        fillPlayers(teams)
    }

    //PHASESc

    if (phase) {
        $("#time_counter").css("color", (phase.phase == "live" || phase.phase == "over" || phase.phase == "warmup" || (phase.phase == "freezetime" && phase.phase_ends_in > 10))
            ? "white"
            : "red");
        $("#defuser").css("display", phase.phase == "defuse"
            ? "block"
            : "none");

        if (phase.phase == "pause") {
            $("#time_counter").css({
                display: "none"
            });

            $('#time_info').css({
                display: "block"
            });
            $("#time_info").html('<span style="letter-spacing: -3.4; transform: scale(1.7,1); display: block; position: relative;">I I</span>');
        }
    
        if (phase.phase == "warmup") {
            $("#time_counter").css({
                display: "none"
            });

            $('#time_info').css({
                display: "block"
            });
            
            $("#time_info").text('WARMUP');
        }

        if(phase.phase != "pause" && phase.phase != "warmup") {
            $("#time_counter").css({
                display: "block"
            });

            $('#time_info').css({
                display: "none"
            });('#time_info').css({
                display: "none"
            });
        }

        if (phase.phase == "bomb" || phase.phase == "defuse") {
            if (phase.phase == "bomb") {
                bomb(parseFloat(phase.phase_ends_in));
            }
            if (phase.phase == "defuse") {
                if (!isDefusing) {
                    longd = 5;
                    if (parseFloat(phase.phase_ends_in) > 5) {
                        longd = 10;
                    }
                    isDefusing = true;
                }

                defuseTimerStart();
                defuseTimerRotate(phase.phase_ends_in,longd);

                var seconds = Math.round(parseFloat(phase.phase_ends_in).toFixed(1));

                $("#bombtimer div").text((seconds < 10 ? seconds : seconds));
            }
        } else {
            isDefusing = false;
            longd = 10;
            resetBomb();
            defuseTimerReset();
        }

        if (phase.phase == "freezetime" || phase.phase.substring(0,7) == "timeout") {
            if (phase.phase_ends_in > 3) {
                if ($(".money").css("opacity") == 0) {
                    $(".money").fadeTo(1000, 1);
                    $("#stats-container").fadeTo(1000,1);
                    $(".stat_t").fadeTo(1000, 1);

                }
            } else {
                if ($(".money").css("opacity") == 1) {
                    $(".money").fadeTo(1000, 0);
                    $(".stat_t").fadeTo(1000, 0);
                    $("#stats-container").fadeTo(1000,0);
                    if (observed && observed.steamid != 1) 
                        $("#player-container").fadeTo(1000, 1);

                    }
                }

        } else {
            if ($(".money").css("opacity") == 1) {
                $(".money").fadeTo(1000, 0);
                $(".stat_t").fadeTo(1000, 0);
                $("#stats-container").fadeTo(1000,0);
                if (observed && observed.steamid != 1) 
                    $("#player-container").fadeTo(1000, 1);
            }
        }
        if (phase.phase_ends_in) {
            var countdown = Math.abs(Math.ceil(phase.phase_ends_in));
            var count_minute = Math.floor(countdown / 60);
            var count_seconds = countdown - (count_minute * 60);
            if (count_seconds < 10) {
                count_seconds = "0" + count_seconds;
            }
            if(phase.phase == "bomb" || phase.phase == "defuse"){
                $("#time_counter").text("").addClass("bomb_timer");
            } else {
                $("#time_counter").text(count_minute + ":" + count_seconds).removeClass("bomb_timer");
            }

            if(countdown < 112 && (phase.phase == "live" || phase.phase == "bomb" || phase.phase == "over")) {
                $(".player_money_count").animate({
                    width: 0
                },150);
            }
        }
    }
    freezetime = round.phase == "freezetime";
    last_round = round_now;
}

function defuseTimerRotate(timeleft, deftim) {
                
    var m = 100 - (timeleft / deftim) * 100;
    
    var deg = m * 3.6;
    
    if(m >= 0 && m <= 50) {
        
        $('#bomb-round-green-wrapper').css({
            transform: "translate(-50%,-50%) rotate(-" + deg + "deg)"
        });
    } else {
        $('#bomb-round-bottom').css({
            borderColor: "#4FC978"
        });
        $('#bomb-round-green-wrapper').css({
            zIndex: 4,
            transform: "translate(-50%,-50%) rotate(-" + deg + "deg)"
        });
    }
    
    if(m >= 100) {
        setTimeout(function() {
            $('#bomb-defusing-container').removeClass("activebomb");
        },500);
    }
}

function defuseTimerReset() {
    $('#bomb-round-green-wrapper').css({
        zIndex: 2,
        transform: "translate(-50%,-50%) rotate(0deg)"
    });
    $('#bomb-round-bottom').css({
        borderColor: "white"
    });
    $('#bomb-defusing-container').removeClass("activebomb");
}

function defuseTimerStart() {
    $('#bomb-defusing-container').addClass("activebomb");
}