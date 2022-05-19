let oWrap = document.querySelector(".wrap"),
    oLevel = document.getElementById("level"),//游戏等级盒子
    oLevelList = document.querySelectorAll("#level p"),//游戏等级
    oMap = document.getElementById("map"),//游戏界面
    oAllFire = document.querySelector(".allFire"),//子弹盒子
    oScore = document.getElementById("score"),//游戏得分
    oSettlement = document.getElementById("settlement"),//结算界面
    oButton =  oSettlement.querySelector("button");//重新开始
for(let i=0; i<oLevelList.length; i++){
    oLevelList[i].onclick = function(e){
        startGame(i,
            {
                x : e.clientX - oWrap.offsetLeft,//获取鼠标到游戏界面的位置
                y : e.clientY - oWrap.offsetTop
            }
        )
    };
}
 
//重新开始
oButton.onclick = function aginGame(){
    //背景图停止移动
    cancelAnimationFrame(oWrap.timer);
    //隐藏得分界面
    oSettlement.style.display = "none";
    //显示等级
    oLevel.style.display = "block";
    //分数清0
    oScore.innerHTML = 0;
    //
    oMap.innerHTML = `<div id="allFire"></div>`;
    oAllFire = document.getElementById("allFire");
}
 
//开始游戏
function startGame(level,pos){
    hiddenShow();
    bgImgMove(level);
    let myPlane = createPlane(level,pos);
    createEnemy(level,myPlane);
    oWrap.score = 0;
}
 
//点击游戏等级的消失与隐藏
function hiddenShow(){
    oLevel.style.display = "none";
    oMap.style.display = "block";
    oScore.style.display = "block";
}
 
//背景图移动
function bgImgMove(level){
    oMap.style.backgroundImage = `url(./img/bg_${level+1}.jpg)`;
    let bgMove = 0;
    (function bgMoveTimer(){
        bgMove++;
        oMap.style.backgroundPositionY = bgMove + "px";
        oWrap.timer = requestAnimationFrame(bgMoveTimer);
    })();
}
 
//我军飞机飞机
function createPlane(level,pos){
    //创建我军飞机
    let oImgPlane = new Image();
    oImgPlane.src = "./img/plane_0.png";
    oImgPlane.width = 70;
    oImgPlane.height = 70;
    oImgPlane.className = "plane";
    oImgPlane.style.left = pos.x - oImgPlane.width / 2  + "px";
    oImgPlane.style.top = pos.y - oImgPlane.height / 2 + "px";
    oMap.appendChild(oImgPlane);
    //鼠标移动是飞机不断获取鼠标位置
    let minLeft = -oImgPlane.width/2,
        minTop = 0,
        maxLeft = oMap.clientWidth - oImgPlane.width/2,
        maxTop = oMap.clientHeight - oImgPlane.height/2;
    document.onmousemove = function(e){
        let left = e.clientX - oWrap.offsetLeft - oImgPlane.width / 2,
            top = e.clientY - oWrap.offsetTop - oImgPlane.height / 2;
        left = Math.min(left,maxLeft);
        left = Math.max(left,minLeft);
        top = Math.min(top,maxTop);
        top = Math.max(top,minTop);
        oImgPlane.style.left = left + "px";
        oImgPlane.style.top = top + "px";
    }
    fire(level,oImgPlane)
    return oImgPlane;
}
 
//子弹
function fire(level,oImgPlane){
 
    //创建子弹
    function createFires(isDouble,n){
        let createFire = new Image();
        createFire.src = "./img/fire.png";
        createFire.width = 30;
        createFire.height = 30;
        createFire.className = "fire"
        let left = oImgPlane.offsetLeft + oImgPlane.width/2 - createFire.width/2 ,
            top = oImgPlane.offsetTop - oImgPlane.height/2;
        if(isDouble){
            left = left + oImgPlane.width/3*n;
        }
        createFire.style.left = left + "px";
        createFire.style.top = top + "px";
        oAllFire.appendChild(createFire);
        
        // 子弹运动
        function fireMove(){
            if(createFire.parentNode){
                top -= 10;
                if(top< -createFire.height){
                    oAllFire.removeChild(createFire);
                }else{
                    createFire.style.top = top + "px";
                    requestAnimationFrame(fireMove);
                }
            }
        }
        setTimeout(()=>{
            requestAnimationFrame(fireMove);
        },20);
    }
 
    //定时生成子弹的频率
    oWrap.fireTimer = setInterval(()=>{
        if(oWrap.score>=100){
            createFires(true,-1);
            createFires(true,+1);
        }else{
            createFires();
        }
    },[200,150,100,50][level])
    
 
}
 
//创建敌军
let enemyNum = 1;
function createEnemy(level,myPlane){
    let speed = [4,6,8,10][level];//游戏模式相对应的的等级飞机下落的速度
        MapW = oMap.clientWidth,
        MapH = oMap.clientHeight;
    oWrap.enemyTimer = setInterval(()=>{
        let createEnemy = new Image();
        createEnemy.index = enemyNum%20 ? 1:0;
        createEnemy.src = `./img/enemy_${["big","small"][createEnemy.index]}.png`;
        createEnemy.width = [100,50][createEnemy.index];
        createEnemy.height = [100,50][createEnemy.index];
        //敌军的血量
        createEnemy.hp = [4,1][createEnemy.index];
        createEnemy.className = "enemy"; 
        //敌军首次出现的位置
        let enemyTop = -createEnemy.height;
        createEnemy.style.top = enemyTop + "px";
        createEnemy.style.left = Math.random()*MapW - createEnemy.width/2 + "px";
        oMap.appendChild(createEnemy);
        enemyNum++;
        console.log(createEnemy.offsetLeft,createEnemy.offsetTop)
        //判断敌军的下落运动
        function enemyMove(){
            if(createEnemy.parentNode){
                enemyTop += speed;
                if(enemyTop>=MapH){
                    oMap.removeChild(createEnemy);
                }else{
                    createEnemy.style.top = enemyTop + "px";
                    //子弹与敌军发生碰撞
                    let arrAllFire = oAllFire.children;
                    for(let i=arrAllFire.length-1; i>=0; i--){
                        let newFire = arrAllFire[i];
                        if(isCollide(newFire,createEnemy)){
                            //撞上的 移出子弹
                            oAllFire.removeChild(newFire)
                            //血量减一
                            createEnemy.hp--;
                            if(createEnemy.hp === 0){
                                oWrap.score += [5,1][createEnemy.index];
                                oScore.innerText = oWrap.score;
                                //敌军发生爆炸 
                                boom({
                                    x : createEnemy.offsetLeft,
                                    y : createEnemy.offsetTop,
                                    w : createEnemy.width,
                                    h : createEnemy.height,
                                    i : createEnemy.index
                                });
                                oMap.removeChild(createEnemy);
                                return;
                            }
                        }
 
                    }
                    //我军与敌军发生碰撞
                    if(myPlane.parentNode&&isCollide(createEnemy,myPlane)){
                        //敌军产生爆炸
                        boom({
                            x:createEnemy.offsetLeft,
                            y:createEnemy.offsetTop,
                            w:createEnemy.width,
                            h:createEnemy.height,
                            i:createEnemy.index
                        });
                        //我军发生爆炸
                        boom({
                            x:myPlane.offsetLeft,
                            y:myPlane.offsetTop,
                            w:myPlane.width,
                            h:myPlane.height,
                            i:2
                        });
                        oMap.removeChild(createEnemy);
                        oMap.removeChild(myPlane)
                        //游戏结束
                        gameOver();
                        return;
                    }
                    requestAnimationFrame(enemyMove);
                }
            }
        }
        requestAnimationFrame(enemyMove);
    },[400,350,300,200][level])
}
 
//是否发生碰撞
function isCollide(newFirePlane,createEnemy){
    //子弹/我军飞机的位置
    let fireTop = newFirePlane.offsetTop,
        fireLeft = newFirePlane.offsetLeft,
        fireBottom = fireTop + newFirePlane.clientHeight,
        fireRight = fireLeft + newFirePlane.clientWidth; 
    //飞机的位置
    let createEnemyTop = createEnemy.offsetTop,
        createEnemyLeft = createEnemy.offsetLeft,
        createEnemyRight = createEnemyLeft+createEnemy.clientWidth,
        createEnemyBotoom = createEnemyTop+createEnemy.clientHeight;
        //没碰上的四种结果
    return !(fireTop>createEnemyBotoom || fireBottom<createEnemyTop || fireLeft>createEnemyRight || fireRight<createEnemyLeft)
}
 
//发生爆炸
function boom(data){
    let createBoom = new Image();
    createBoom.src = `./img/${["boom_big","boom_small","plane_0"][data.i]}.png`;
    createBoom.className = "boom" + ["","","2"][data.i];
    createBoom.width = data.w;
    createBoom.height = data.h;
    createBoom.style.top = data.y + "px";
    createBoom.style.left = data.x + "px";
    oMap.appendChild(createBoom);
    setTimeout(()=>{
        createBoom.parentNode&&oMap.removeChild(createBoom);
    },[1200,1200,2500][data.i])
}
 
//游戏结束
function gameOver(){
    clearInterval(oWrap.enemyTimer);
    clearInterval(oWrap.fireTimer);
    document.onmousemove = null;
    gameSettlement();
}
 
//结算游戏
function gameSettlement(){
    let oTotalscore = oSettlement.querySelector(".totalscore"),
        oAppraise = oSettlement.querySelector(".appraise");
    if(oWrap.score < 50){
        oAppraise.innerHTML = "青铜";
    }else if(oWrap.score <100){
        oAppraise.innerHTML = "黄金";
    }else if(oWrap.score <200){
        oAppraise.innerHTML = "钻石";
    }else{
        oAppraise.innerHTML = "王者";
    }
    oTotalscore.innerHTML = oWrap.score;
    oScore.style.display = "none";
    oSettlement.style.display = "block";
};