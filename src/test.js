function solution(dartResult) {
  var answer = 0;
  var arr = [];
  var dartArray = dartResult.split('');
  var count = 0;
  // array에 각 스코어 저장
  for(let i=1;i<dartArray.length;i++) {
    console.log('typeof(+dartArray[i])', typeof(+dartArray[i]));
    if(typeof(+dartArray[i]) === 'number') {
      arr.push(dartArray.slice(count, i))
      console.log('arr ', arr)
      count = i;
    } 
  }
  arr.push(dartArray.slice(count, dartArray.length));
  // console.log('arr ', arr);
  // 계산
  // ['2', 'D', '*']
  var newArr = [];
  for(let i=0;i<3;i++) {
    var temp = Number(arr[i][0]) ^ calculation[arr[i][1]];
    if(!arr[i][2]) break;
    else {
      temp = temp * option[arr[i][2]];
      if(newArr[i][2] === '*' && newArr.length !== 0) newArr[newArr.length - 1] *= 2;
    } 
    newArr.push(temp);
  }
  answer = newArr.reduce((acc, cur) => {
    return acc+cur;
  }, 0)
  return answer;
}

var calculation = {
  'S': 1,
  'D': 2,
  'T': 3,
}
var option = {
  '*': 2,
  '#': -1,
}