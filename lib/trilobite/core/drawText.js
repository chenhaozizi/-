

function setText(ctx, text, x, y, width, height, hasStroke, isVertical){
  ctx.setFontSize(8);
  ctx.setFillStyle("#ffffff");
  //调用文字竖排横排
  drawText(ctx, text, x, y, width, height, hasStroke, isVertical)
  ctx.stroke();
}




/**
 * ctx:cavas选择器
 * text：文字
 * x：x坐标
 * y:y坐标
 * width:文本限制宽度
 * height:文本限制高度
 * hasStroke:是否对字体进行描边
 * isVertical:是否竖排文字
 */
// 画文本，支持多行、自动换行、竖排文字
function drawText(ctx, text, x, y, width, height, hasStroke, isVertical) {
  if (!isVertical) {
    drawTextHorizontal(ctx, text, x, y, width, height, hasStroke)
  } else {
    drawTextVertical(ctx, text, x, y, width, height, hasStroke)
  }
}

// 画横排文本，垂直居中，可以垂直溢出
function drawTextHorizontal(ctx, text, x, y, width, height, hasStroke = false) {
  let oldBaseLine = ctx.textBaseline
  ctx.textBaseline = 'hanging'
  let lineHeight = parseInt(ctx.font) // ctx.font必须以'XXpx'开头

  // 计算每一行
  let lines = []
  let curLine = ''
  for (let char of text) {
    let nextLine = curLine + char
    if (char === '\n' || ctx.measureText(nextLine).width > width) {
      lines.push(curLine)
      curLine = char === '\n' ? '' : char
    } else {
      curLine = nextLine
    }
  }
  lines.push(curLine)

  // 逐行画文本
  let lineY = y + (height - lineHeight * lines.length) / 2
  for (let line of lines) {
    let lineX
    if (ctx.textAlign === 'center') {
      lineX = x  + width / 2
    } else if (ctx.textAlign === 'right') {
      lineX = x + width+2
    } else {
      lineX = x
    }
    if (hasStroke) {
      ctx.strokeText(line, lineX, lineY, width)
    }
    ctx.fillText(line, lineX, lineY, width)
    lineY += lineHeight+3;
    lineX = lineX+3
  }

  ctx.textBaseline = oldBaseLine
}

// 画竖排文本，从右到左，水平居中，可以水平溢出
function drawTextVertical(ctx, text, x, y, width, height, hasStroke = false) {
  let [oldAlign, oldBaseLine] = [ctx.textAlign, ctx.textBaseline];
  [ctx.textAlign, ctx.textBaseline] = ['center', 'middle']
  let lineWidth = parseInt(ctx.font) // ctx.font必须以'XXpx'开头

  // 计算每个字符的尺寸信息
  let charInfo = []
  for (let char of text) {
    let cInfo = {
      char: char,
      needsRotation: needsRotation(char) // 中日韩文字不用旋转
    }
    if (cInfo.needsRotation) {
      [cInfo.width, cInfo.height] = [lineWidth, ctx.measureText(char).width]
    } else {
      [cInfo.width, cInfo.height] = [ctx.measureText(char).width, lineWidth]
    }
    charInfo.push(cInfo)
  }

  // 计算每一列
  let lineInfo = []
  let curLine = []
  let curLineHeight = 0
  for (let info of charInfo) {
    if (info.char === '\n' || curLineHeight + info.height > height) {
      lineInfo.push({
        charInfo: curLine,
        height: curLineHeight
      })
      curLine = info.char === '\n' ? [] : [info]
      curLineHeight = info.height
    } else {
      curLine.push(info)
      curLineHeight += info.height
    }
  }
  lineInfo.push({
    charInfo: curLine,
    height: curLineHeight
  })

  // 逐字画文本
  let lineX = x + (width + lineWidth * lineInfo.length) / 2 - lineWidth / 2 // 列中心的坐标
  for (let lInfo of lineInfo) {
    let charY // 字符顶端的坐标
    if (oldAlign === 'center') {
      charY = y + (height - lInfo.height) / 2
    } else if (oldAlign === 'right') { // 这里右对齐视为底端对齐，左对齐视为顶端对齐
      charY = y + height - lInfo.height
    } else {
      charY = y
    }

    // 画一列文本
    for (let cInfo of lInfo.charInfo) {
      ctx.translate(lineX, charY + cInfo.height / 2)
      if (cInfo.needsRotation) {
        ctx.rotate(90 * Math.PI / 180)
      }
      // 画一个字符
      if (hasStroke) {
        ctx.strokeText(cInfo.char, 0, 0)
      }
      ctx.fillText(cInfo.char, 0, 0)
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      charY += cInfo.height
    }
    lineX -= lineWidth+3
  }

  [ctx.textAlign, ctx.textBaseline] = [oldAlign, oldBaseLine]
}

// 需要旋转的Unicode码范围，基本上是CJK文字
const NO_ROTATION_RANGE = [
  [0x2E80, 0x2FEF],
  [0x3040, 0x9FFF],
  [0xAC00, 0xD7FF],
  [0xF900, 0xFAFF],
  [0x1D300, 0x1D35F],
  [0x20000, 0x2FA1F]
]

function needsRotation(char) {
  let codePoint = char.codePointAt(0)
  for (let [lowerBound, upperBound] of NO_ROTATION_RANGE) {
    if (lowerBound <= codePoint && codePoint <= upperBound) {
      return false
    }
  }
  return true
}

module.exports = {
  setText: setText
}