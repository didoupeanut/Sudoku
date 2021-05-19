let workSteps = 0;
let actionPushTimes = 0;
let actionPopTimes = 0;
let actionListMaxSize = 0;
let allInValidSudoes = 0;

/**
 * print sudo
 **/
var printSudo = function (sudo) {
    if (sudo == null || sudo.length <= 0) {
        console.log("sudo is " + (sudo == null ? "null" : sudo.length));
        return;
    }

    console.log("-------------------------");
    for (var i = 0; i < sudo.length; i++) {
        var line = "|";
        for (var j = 0; j < 3 * 3; j++) {
            line += sudo[i][j];
            if (j == 2 || j == 5) {
                line += "|";
            } else if (j < 8) {
                line += ", ";
            }
        }
        line += "|";
        console.log(line);
        if (i == 2 || i == 5) {
            console.log("-------------------------");
        }
    }
    console.log("-------------------------");
};

/*
 * getAllInvalidPoses: get all invalid number's positions in the large 9-cell sudo
 * sudo:
 * r: element's x-coordinate in large 9-cell
 * c: element's y-coordinate in large 9-cell
 * e: element
 */
exports.getAllInvalidPoses = function (sudo, e) {
    if (typeof e !== "number") {
        return [];
    }
    if (sudo == null || sudo.length == 0) {
        return [];
    }

    if (e < 0 || e > 9) {
        return [];
    }

    var poses = [];

    var cnt_r = 0; //total count of e in the row
    var cnt_c = 0; //total count of e in the col
    var poses_r = [];
    var poses_c = [];

    for (var i = 0; i < 9; i++) {
        cnt_r = 0;
        cnt_c = 0;
        for (var j = 0; j < 9; j++) {
            if (sudo[i][j] == e) {
                if (cnt_r > 0) {
                    if (cnt_r == 1) {
                        poses.push(poses_r);
                    }
                    poses.push([i, j]);
                } else {
                    poses_r = [i, j];
                }
                cnt_r++;
            }
            if (sudo[j][i] == e) {
                if (cnt_c > 0) {
                    if (cnt_c == 1) {
                        poses.push(poses_c);
                    }
                    poses.push([j, i]);
                } else {
                    poses_c = [j, i];
                }
                cnt_c++;
            }
        }
    }

    var cnt_o = 0; //total count of e in the small 9-cell
    var poses_o = [];
    for (var i = 0; i < 9; i++) {
        var cell_r = parseInt(i / 3);
        var cell_c = i % 3;
        cnt_o = 0;
        for (var r1 = cell_r * 3; r1 < (cell_r + 1) * 3; r1++) {
            for (var c1 = cell_c * 3; c1 < (cell_c + 1) * 3; c1++) {
                if (sudo[r1][c1] == e) {
                    if (cnt_o > 0) {
                        if (cnt_o == 1) {
                            poses.push(poses_o);
                        }
                        poses.push([r1, c1]);
                    } else {
                        poses_o = [r1, c1];
                    }
                    cnt_o++;
                }
            }
        }
    }

    //console.log("invalid posed = " + JSON.stringify(poses));
    return poses;
};

/*
 * checkXRCValid: check element in row & colums is valid or not
 * sudo:
 * r: element's x-coordinate in large 9-cell
 * c: element's y-coordinate in large 9-cell
 * e: element
 */
var checkXRCValid = function (sudo, r, c, e) {
    if (sudo[r][c] > 0 && sudo[r][c] < 10) {
        return false;
    }

    for (var i = 0; i < 9; i++) {
        if (sudo[r][i] == e) {
            return false;
        }
        if (sudo[i][c] == e) {
            return false;
        }
    }
    return true;
};


/*
 * checkXValid: check element in row & colums & small 9-cell is valid or not
 * sudo:
 * r: element's x-coordinate in large 9-cell
 * c: element's y-coordinate in large 9-cell
 * e: element
 */
exports.checkXValid = function (sudo, r, c, e) {
    if (typeof r !== "number" || typeof c !== "number" || typeof e !== "number") {
        return false;
    }
    if (sudo == null || sudo.length == 0) {
        return false;
    }
    if (r < 0 || r > 9) {
        return false;
    }
    if (c < 0 || c > 9) {
        return false;
    }
    if (e < 0 || e > 9) {
        return false;
    }

    if (!checkXRCValid(sudo, r, c, e)) {
        return false;
    }

    var cell_r = parseInt(r / 3);
    var cell_c = parseInt(c / 3);
    for (var r1 = cell_r * 3; r1 < (cell_r + 1) * 3; r1++) {
        for (var c1 = cell_c * 3; c1 < (cell_c + 1) * 3; c1++) {
            if (sudo[r1][c1] == e) {
                return false;
            }
        }
    }
    //console.log("the first least number of min sudo number is [" + r + ", " + c + "] = " + e + " is valid");
    return true;
};

/**
 *checkSudoValid
 *sudo:
 * check the whole sudo is valid or not
 **/
exports.checkSudoValid = function (sudo) {
    for (var i = 0; i < 9; i++) {
        var t = 0;
        for (var c = 0; c < 9; c++) {
            if (sudo[i][c] > 0 && sudo[i][c] < 10) {
                t |= 1 << (sudo[i][c] - 1);
            }
        }

        if ((t ^ 511) > 0) {
            //console.log("sudo row[" + i + "] is invalid");
            return false;
        }

        t = 0;
        for (var r = 0; r < 9; r++) {
            if (sudo[r][i] > 0 && sudo[r][i] < 10) {
                t |= 1 << (sudo[r][i] - 1);
            }
        }

        if ((t ^ 511) > 0) {
            //console.log("sudo col[" + i + "] is invalid");
            return false;
        }
    }

    for (var cell9 = 0; cell9 < 9; cell9++) {
        var cell9_x = parseInt(cell9 / 3);
        var cell9_y = cell9 % 3;
        var t = 0;
        for (var r = cell9_x * 3; r < (cell9_x + 1) * 3; r++) {
            for (var c = cell9_y * 3; c < (cell9_y + 1) * 3; c++) {
                if (sudo[r][c] > 0 && sudo[r][c] < 10) {
                    t |= 1 << (sudo[r][c] - 1);
                }
            }
        }

        if ((t ^ 511) > 0) {
            //console.log("sudo cell[" + cell + "] = " + t + " is invalid");
            return false;
        }
    }
    return true;
};

var randomFillIntoSmall9Cell = function (sudo, cell9) {
    var numbers = [3, 8, 1, 5, 9, 6, 4, 2, 7]; //random seed
    for (var i = 0; i < numbers.length; i++) {
        var pos1 = parseInt(Math.random() * numbers.length);
        var pos2 = parseInt(Math.random() * numbers.length);
        var tmp = numbers[pos1];
        numbers[pos1] = numbers[pos2];
        numbers[pos2] = tmp;
    }
    var cell9_x = parseInt(cell9 / 3);
    var cell9_y = cell9 % 3;
    var pos = 0;
    for (var i = cell9_x * 3; i < (cell9_x + 1) * 3; i++) {
        for (var j = cell9_y * 3; j < (cell9_y + 1) * 3; j++) {
            fillValidNumberIntoCell(sudo, i, j, numbers[pos++]);
        }
    }
};

var getAvaliableNumbersCnt = function (n) {
    var cnt = 0;
    var shift = 0;
    while (n > 0) {
        if ((n & 1) > 0) {
            cnt++;
        }
        n >>= 1;
    }
    //console.log("getAvaliableNumbersCnt: n = " + n + ", shift = " + shift + ", cnt = " + cnt);
    return cnt;
};

/*
 * function name: selectOneNumber
 * params: n
 * return the max number less than n and equal to 2^n n is integer
 */
var selectOneNumber = function (n) {
    return n > 255 ?
        256 :
        n > 127 ?
        128 :
        n > 63 ?
        64 :
        n > 31 ?
        32 :
        n > 15 ?
        16 :
        n > 7 ?
        8 :
        n > 3 ?
        4 :
        n > 1 ?
        2 :
        n > 0 ?
        1 :
        0;
};

/*
 * translate avaliable number to sudo number
 * params: n avaliable number, eg: 0, 1, 2, 4, 8, 16, 32, 64, 128, 256
 * return 0 -> 0, 1 -> 1, 2 -> 2, 4 -> 3, 8 -> 4, 16 -> 5, 32 -> 6, 64 -> 7 128 -> 8, 256 -> 9
 */
var translateToSudoNumber = function (n) {
    var c = 0;
    while (n > 0) {
        n >>>= 1;
        c++;
    }
    return c;
}

var SUDO_TEMPLATE = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
];

var checkActionListHasXY = function (actionList, x, y) {
    var has = false;
    for (var k = 0; k < actionList.length; k++) {
        has = ((actionList[k][0] == x && actionList[k][1] == y) ? true : false);
        if (has) {
            break;
        }
    }
    return has;
};

var fillValidNumberIntoCell = function (sudo, x, y, n) {
    sudo[x][y] = n;
    workSteps++;
}

var fillNumberAndClearAvaliable = function (sudo, x, y, selectAvaliableNumber, avaliableSudo, avaliableNumbersCnt) {
    fillValidNumberIntoCell(sudo, x, y, translateToSudoNumber(selectAvaliableNumber));
    avaliableSudo[x][y] = 0;
    avaliableNumbersCnt[x][y] = 0;
}

/*
 * actionListHasAvaliableValue
 * if actionList one action contains avaliable value(actionList[x][3] > 0), return the action's index
 * or return -1
 */
var actionListHasAvaliableValue = function (actionList) {
    var isValid = true;
    if (actionList == null || actionList.length == 0) {
        return -1;
    }

    for (var i = 0; i < actionList.length; i++) {
        if (actionList[i][3] > 0) {
            return i;
        }
    }
    return -1;
}

var switchToNextBranch = function (sudo, avaliableSudo, avaliableNumbersCnt, actionList) {
    while (actionList.length > 0) {
        var action = actionList.pop();
        actionPopTimes++;
        if (action[3] != 0) {
            fillValidNumberIntoCell(sudo, action[0], action[1], 0);
            var saveAvaliableSudo = action[4];
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 9; j++) {
                    avaliableSudo[i][j] = saveAvaliableSudo[i][j];
                    if (avaliableSudo[i][j] > 0) {
                        fillValidNumberIntoCell(sudo, i, j, 0);
                    }
                }
            }
            avaliableSudo[action[0]][action[1]] = action[3];
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 9; j++) {
                    avaliableNumbersCnt[i][j] = getAvaliableNumbersCnt(avaliableSudo[i][j]);
                }
            }
            return true;
        }
    }
    return false;
}

var createNewSudo = function () {
    var sudo = []; //create an new empty sudo
    for (var i = 0; i < 9; i++) {
        sudo.push(SUDO_TEMPLATE[i].concat());
    }
    randomFillIntoSmall9Cell(sudo, 0);
    randomFillIntoSmall9Cell(sudo, 4);
    randomFillIntoSmall9Cell(sudo, 8);

    //printSudo(sudo);
    return sudo;
}

var completeSudo = function (sudo, avaliableSudo, avaliableNumbersCnt, actionList) {
    /* actionList is two-dimensional array as one stack, 
     * store actions list, every action include x-coor, y-coor, select number, avaliable number in sudo[x][y]
     * left avaliable number
     */
    if (sudo == null) { //if actionList has content, sudo is one valid sudo; if sudo == null, generater a sudo.
        return null;
    }

    if (actionList == null || actionList.length == 0) {
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                if (sudo[i][j] == 0) {
                    var t = 0;
                    for (var k = 0; k < 9; k++) {
                        t |= sudo[i][k] > 0 ? 1 << (sudo[i][k] - 1) : 0;
                        t |= sudo[k][j] > 0 ? 1 << (sudo[k][j] - 1) : 0;
                    }
                    var cell9_r = parseInt(i / 3);
                    var cell9_c = parseInt(j / 3);
                    for (var r = cell9_r * 3; r < (cell9_r + 1) * 3; r++) {
                        for (var c = cell9_c * 3; c < (cell9_c + 1) * 3; c++) {
                            t |= sudo[r][c] > 0 ? 1 << (sudo[r][c] - 1) : 0;
                        }
                    }
                    avaliableSudo[i][j] = 511 - t;
                    avaliableNumbersCnt[i][j] = getAvaliableNumbersCnt(avaliableSudo[i][j]);
                }
            }
        }
        //printSudo(avaliableSudo);
        //printSudo(avaliableNumbersCnt);
    }

    do {
        var min = 9;
        var x = -1;
        var y = -1;
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                if (!checkActionListHasXY(actionList, i, j) && avaliableNumbersCnt[i][j] > 0 && avaliableNumbersCnt[i][j] < min) {
                    min = avaliableNumbersCnt[i][j];
                    x = i;
                    y = j;
                }
            }
        }
        if (x == -1 && y == -1) {
            //console.log("1 the new sudo: ");
            //printSudo(sudo);
            //printSudo(avaliableSudo);
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 9; j++) {
                    if (avaliableSudo[i][j] > 0) {
                        fillValidNumberIntoCell(sudo, i, j, translateToSudoNumber(avaliableSudo[i][j]));
                    }
                }
            }
            return sudo; //sudo generat successfully.
        }
        var selectAvaliableNumber = selectOneNumber(avaliableSudo[x][y]);
        var isValid = false;
        var countIsOne = [];
        var a = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        var a_cnt = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        var b = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        var b_cnt = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        var d = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        var d_cnt = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        if (exports.checkXValid(sudo, x, y, translateToSudoNumber(selectAvaliableNumber))) {
            isValid = true;
            fillValidNumberIntoCell(sudo, x, y, translateToSudoNumber(selectAvaliableNumber));

            for (var i = 0; i < 9; i++) {
                if (i != y) {
                    a[i] = (avaliableSudo[x][i] & (~selectAvaliableNumber));
                    a_cnt[i] = getAvaliableNumbersCnt(a[i]);
                    if (a_cnt[i] == 1) {
                        countIsOne.push([x, i, a[i]]);
                    }
                }

                if (i != x) {
                    b[i] = (avaliableSudo[i][y] & (~selectAvaliableNumber));
                    b_cnt[i] = getAvaliableNumbersCnt(b[i]);
                    if (b_cnt[i] == 1) {
                        countIsOne.push([i, y, b[i]]);
                    }
                }
            }

            var cell_r = parseInt(x / 3);
            var cell_c = parseInt(y / 3);
            for (var r = cell_r * 3; r < (cell_r + 1) * 3; r++) {
                for (var c = cell_c * 3; c < (cell_c + 1) * 3; c++) {
                    if (r != x && c != y) {
                        d[r * 3 + c] = (avaliableSudo[r][c] & (~selectAvaliableNumber));
                        d_cnt[r * 3 + c] = (getAvaliableNumbersCnt(d[r * 3 + c]));
                        if (avaliableNumbersCnt[r][c] == 1) {
                            countIsOne.push([r, c, d[r * 3 + c]]);
                        }
                    }
                }
            }

            if (countIsOne.length > 0) {
                for (var i = 0; i < countIsOne.length; i++) {
                    if (!exports.checkXValid(sudo, countIsOne[i][0], countIsOne[i][1], translateToSudoNumber(countIsOne[i][2]))) {
                        isValid = false;
                        fillValidNumberIntoCell(sudo, x, y, 0);
                        for (var j = 0; j < i; j++) {
                            fillValidNumberIntoCell(sudo, countIsOne[j][0], countIsOne[j][1], 0);
                        }
                        break;
                    } else {
                        fillValidNumberIntoCell(sudo, countIsOne[i][0], countIsOne[i][1], translateToSudoNumber(countIsOne[i][2]));
                    }
                }
            }
        }

        if (isValid) {
            var action = [x, y, selectAvaliableNumber, avaliableSudo[x][y] - selectAvaliableNumber];
            var saveAvaliableSudo = [];
            for (var i = 0; i < 9; i++) {
                saveAvaliableSudo.push(avaliableSudo[i].concat());
            }
            action.push(saveAvaliableSudo);
            actionList.push(action);
            actionPushTimes++;
            if (actionList.length > actionListMaxSize) {
                actionListMaxSize = actionList.length;
            }

            fillNumberAndClearAvaliable(sudo, x, y, selectAvaliableNumber, avaliableSudo, avaliableNumbersCnt);
            for (var i = 0; i < 9; i++) {
                if (i != y) {
                    avaliableSudo[x][i] = a[i];
                    if (a_cnt[i] == 1) {
                        fillNumberAndClearAvaliable(sudo, x, i, avaliableSudo[x][i], avaliableSudo, avaliableNumbersCnt);
                    }
                }
                if (i != x) {
                    avaliableSudo[i][y] = b[i];
                    if (b_cnt[i] == 1) {
                        fillNumberAndClearAvaliable(sudo, i, y, avaliableSudo[i][y], avaliableSudo, avaliableNumbersCnt);
                    }
                }
            }

            var cell_r = parseInt(x / 3);
            var cell_c = parseInt(y / 3);
            for (var r = cell_r * 3; r < (cell_r + 1) * 3; r++) {
                for (var c = cell_c * 3; c < (cell_c + 1) * 3; c++) {
                    if (r != x && c != y) {
                        avaliableSudo[r][c] = d[r * 3 + c];
                        if (d_cnt[r * 3 + c] == 1) {
                            fillNumberAndClearAvaliable(sudo, r, c, avaliableSudo[r][c], avaliableSudo, avaliableNumbersCnt);
                        }
                    }
                }
            }
        } else {
            //printSudo(avaliableSudo);
            //printSudo(sudo);
            avaliableSudo[x][y] -= selectAvaliableNumber;
            avaliableNumbersCnt[x][y] = getAvaliableNumbersCnt(avaliableSudo[x][y]);
            if (avaliableSudo[x][y] == 0) {
                if (!switchToNextBranch(sudo, avaliableSudo, avaliableNumbersCnt, actionList)) {
                    return sudo;
                }
            }
        }
        //console.log("actionList length = " + actionList.length);
        //console.log(JSON.stringify(actionList));
    } while (1);

    //console.log("2 the new sudo: ");
    //printSudo(avaliableSudo);
    //printSudo(sudo);
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (avaliableSudo[i][j] > 0) {
                fillValidNumberIntoCell(sudo, i, j, translateToSudoNumber(avaliableSudo[i][j]));
            }
        }
    }
    return sudo; //generate sudo successfully, it's valid or invalid, so must check is valid or not after execute completeSudo()
};

var generateHoles = function (hard) {
    var TOTAL_COUNT = 81;
    var poses = [];
    var holes = [];
    for (var i = 0; i < 9; i++) {
        holes.push([1, 1, 1, 1, 1, 1, 1, 1, 1]);
    }

    for (var i = 0; i < TOTAL_COUNT; i++) {
        poses.push(i);
    }

    for (var i = 0; i < TOTAL_COUNT * 2; i++) {
        var p1 = parseInt(Math.random() * TOTAL_COUNT);
        var p2 = parseInt(Math.random() * TOTAL_COUNT);
        var tmp = poses[p1];
        poses[p1] = poses[p2];
        poses[p2] = tmp;
    }
    var cnt = 0;
    do {
        var pos = poses[cnt];
        var i = parseInt(pos / 9);
        var j = pos % 9;
        //console.log(pos + ": " + i + ", " + j);
        holes[i][j] = 0;
    } while (++cnt < hard);

    return holes;
}

var generateOneValidSudo = function () {
    var sudo;
    do {
        var avaliableSudo = []; //store all avaliable numbers for every sudo's cell
        var avaliableNumbersCnt = []; //store all avaliable numbers' count for every sudo's cell in avaliableSudo
        var actionList = [];
        workSteps = 0;
        actionPushTimes = 0;
        actionPopTimes = 0;
        actionListMaxSize = 0;
        for (var i = 0; i < 9; i++) {
            avaliableSudo.push(SUDO_TEMPLATE[i].concat());
            avaliableNumbersCnt.push(SUDO_TEMPLATE[i].concat());
        }
        sudo = createNewSudo();
        completeSudo(sudo, avaliableSudo, avaliableNumbersCnt, actionList);
        //printSudo(sudo);
    } while (!exports.checkSudoValid(sudo));
    //console.log("total work steps " + workSteps);
    //console.log("total push actinList times is " + actionPushTimes);
    //console.log("total pop actinList times is " + actionPopTimes);
    //console.log("the max actinList size is " + actionListMaxSize);
    return sudo;
}

exports.generateAllValidSudo = function () {
    var allSudoes = []; //store all valid sudo
    var avaliableSudo = []; //store all avaliable numbers for every sudo's cell
    var avaliableNumbersCnt = []; //store all avaliable numbers' count for every sudo's cell in avaliableSudo
    var actionList = [];
    //var actionListBackup = [];
    workSteps = 0;
    actionPushTimes = 0;
    actionPopTimes = 0;
    actionListMaxSize = 0;
    for (var i = 0; i < 9; i++) {
        avaliableSudo.push(SUDO_TEMPLATE[i].concat());
        avaliableNumbersCnt.push(SUDO_TEMPLATE[i].concat());
    }
    var sudo = createNewSudo();
    do {
        completeSudo(sudo, avaliableSudo, avaliableNumbersCnt, actionList);
        if (exports.checkSudoValid(sudo)) {
            //console.log("sudo is valid");
            var s = [];
            for (var i = 0; i < 9; i++) {
                s.push(sudo[i].concat());
            }
            allSudoes.push(s);
        } else {
            allInValidSudoes++;
            //console.log("actionListBackup length = " + actionListBackup.length);
            //console.log(JSON.stringify(actionListBackup));
            //console.log("valid sudo:");
            //console.log(JSON.stringify(allSudoes[allSudoes.length - 1]));
            //console.log("invalid sudo:");
            //console.log(JSON.stringify(sudo));
            //console.log("actionList length = " + actionList.length);
            //console.log(JSON.stringify(actionList));
        }

        var index = actionListHasAvaliableValue(actionList);
        if (index == -1 || !switchToNextBranch(sudo, avaliableSudo, avaliableNumbersCnt, actionList)) {
            break;
        }
    } while (1);
    console.log("total work steps " + workSteps);
    console.log("total push actinList times is " + actionPushTimes);
    console.log("total pop actinList times is " + actionPopTimes);
    console.log("the max actinList size is " + actionListMaxSize);
    console.log("the total of invalid sudo: " + allInValidSudoes);
    console.log("the total of all valid sudo: " + allSudoes.length);
    return allSudoes;
};

/**
 * generateSudo
 * @param {*} hard : 0 ~ 5
 * 难度	洞数目	最佳完成步数
 * 0级	40~42	< 250
 * 1级	44~46	< 500
 * 2级	48~50	< 1000
 * 3级	52~54	< 2000
 * 4级	55~57	< 10000
 * 5级	58~60	< 20000
 */
exports.generateSudo = function (hard) {
    var totalHoles;
    var totalSteps;
    if (hard == 1) {
        totalHoles = [20, 21, 22];
        totalSteps = [20, 30];
    } else if (hard == 2) {
        totalHoles = [27, 28, 29];
        totalSteps = [50, 150];
    } else if (hard == 3) {
        totalHoles = [36, 37, 38];
        totalSteps = [200, 300];
    } else if (hard == 4) {
        totalHoles = [45, 46, 47];
        totalSteps = [400, 500];
    } else if (hard == 5) {
        totalHoles = [50, 51, 52];
        totalSteps = [600, 700];
    } else {
        console.log("hard's value must between 0 and 5!");
        return null;
    }

    var holesIndex = 0;
    do {
        var holes = generateHoles(totalHoles[holesIndex]);
        var sudo = generateOneValidSudo();
        var sudo2 = []; //only for test hard
        //printSudo(holes);
        for (var i = 0; i < 9; i++) {
            sudo2[i] = sudo[i].concat();
            for (var j = 0; j < 9; j++) {
                sudo[i][j] = sudo[i][j] * holes[i][j];
                sudo2[i][j] = sudo[i][j];
            }
        }
        //printSudo(sudo);
        var avaliableSudo = []; //store all avaliable numbers for every sudo's cell
        var avaliableNumbersCnt = []; //store all avaliable numbers' count for every sudo's cell in avaliableSudo
        var actionList = [];
        for (var i = 0; i < 9; i++) {
            avaliableSudo.push(SUDO_TEMPLATE[i].concat());
            avaliableNumbersCnt.push(SUDO_TEMPLATE[i].concat());
        }
        do {
            workSteps = 0;
            actionPushTimes = 0;
            actionPopTimes = 0;
            actionListMaxSize = 0;
            completeSudo(sudo2, avaliableSudo, avaliableNumbersCnt, actionList);
            if (exports.checkSudoValid(sudo2)) { //if find the first valid sudo, return the sudo
                console.log(hard + ", " + workSteps + ", " + actionPushTimes + ", " + actionPopTimes + ", " + actionListMaxSize);
                if (workSteps >= totalSteps[0] && workSteps < totalSteps[1]) {
                    return sudo;
                }
            }

            var index = actionListHasAvaliableValue(actionList);
            if (index == -1 || !switchToNextBranch(sudo2, avaliableSudo, avaliableNumbersCnt, actionList)) {
                break;
            }
        } while (1);
        if (++holesIndex == totalHoles.length) {
            holesIndex = 0;
        }
    } while (1);
    //printSudo(sudo);
    //console.log("total work steps " + workSteps);
    //console.log("total push actinList times is " + actionPushTimes);
    //console.log("total pop actinList times is " + actionPopTimes);
    //console.log("the max actinList size is " + actionListMaxSize);
}

/*
var args = process.argv.splice(2);
var hard = 0;
for (var i = 0; i < args.length; i++) {
    if (args[i] == '-h') {
        hard = args[i + 1];
    }
}
var sudo = exports.generateSudo(hard);
printSudo(sudo);
//*/

//console.time("generateOneValidSudo");
//var sudo = generateOneValidSudo();
//console.timeEnd("generateOneValidSudo");
//printSudo(sudo);

/*
console.time("generate all valid sudoes");
var allsudoes = exports.generateAllValidSudo();
console.timeEnd("generate all valid sudoes");
// (var i = 0; i < allsudoes.length; i++) {
//	printSudo(allsudoes[i]);
//}
//**/