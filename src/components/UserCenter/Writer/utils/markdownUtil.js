/* eslint-disable no-continue */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/**
 * Inserts "textToBeInserted" in "text" at the "insertionPosition"
 *
 * @param {string} originalText
 * @param {string} textToInsert
 * @param {number} insertionPosition
 * @returns
 */
export function insertText(originalText, textToInsert, insertionPosition) {
  const newText = [
    originalText.slice(0, insertionPosition),
    textToInsert,
    originalText.slice(insertionPosition),
  ].join('')
  return { newText, insertionLength: textToInsert.length }
}

export function getSurroundingWord(text, position) {
  if (!text) throw Error("Argument 'text' should be truthy")

  const isWordDelimiter = c => c === ' ' || c.charCodeAt(0) === 10

  // leftIndex is initialized to 0 because if position is 0, it won't even enter the iteration
  let leftIndex = 0
  // rightIndex is initialized to text.length because if position is equal to text.length it won't even enter the interation
  let rightIndex = text.length

  // iterate to the left
  for (let i = position; i - 1 > -1; i -= 1) {
    if (isWordDelimiter(text[i - 1])) {
      leftIndex = i
      break
    }
  }

  // iterate to the right
  for (let i = position; i < text.length; i += 1) {
    if (isWordDelimiter(text[i])) {
      rightIndex = i
      break
    }
  }

  return {
    word: text.slice(leftIndex, rightIndex),
    position: {
      start: leftIndex,
      end: rightIndex,
    },
  }
}

export function selectWordIfCaretIsInsideOne({ text, selection }) {
  if (text && text.length && selection.start === selection.end) {
    // the user is pointing to a word
    return getSurroundingWord(text, selection.start).position
  }
  return selection
}

export function insertBeforeAndAfter(markdownState, insertion) {
  const { text } = markdownState
  let { selection } = markdownState
  selection = selectWordIfCaretIsInsideOne({ text, selection })
  // the user is selecting a word section
  const { newText, insertionLength } = insertText(
    text,
    insertion,
    selection.start
  )
  const finalText = insertText(
    newText,
    insertion,
    selection.end + insertionLength
  ).newText
  return {
    text: finalText,
    selection: {
      start: selection.start + insertionLength,
      end: selection.end + insertionLength,
    },
  }
}

export function addTab({ text, selection }, reverse) {
  let start = 0
  for (let i = selection.start; i - 1 > -1; i -= 1) {
    if (text[i - 1] === '\n') {
      start = i
      break
    }
  }

  let end = text.length
  for (let i = selection.end; i < text.length; i += 1) {
    if (text[i + 1] === '\n') {
      end = i
      break
    }
  }

  const substring = text.slice(start, end)
  const strings = substring.split(/\n/)

  let addLength = 0
  let spaces = 0
  const newText = strings
    .map(line => {
      const str = line.match(/^ +/)
      spaces = str && str[0] ? str[0].length : 0

      if (reverse) {
        let removeSpaces = 4
        if (!spaces || spaces % 4 !== 0) removeSpaces = spaces % 4

        addLength -= removeSpaces
        return line.slice(removeSpaces)
      }

      let addSpaces = '    '
      if (spaces % 4 === 1) addSpaces = '   '
      if (spaces % 4 === 2) addSpaces = '  '
      if (spaces % 4 === 3) addSpaces = ' '

      addLength += addSpaces.length
      return addSpaces + line
    })
    .join('\n')

  text = text.slice(0, start) + newText + text.slice(end)

  if (strings.length <= 1)
    selection = {
      start: start + addLength + spaces,
      end: start + addLength + spaces,
    }
  else
    selection = {
      start,
      end: end + addLength,
    }

  return { text, selection }
}

/**
 * Inserts the given text before. The selection is moved ahead so the
 *
 * @export
 * @param {string} originalText
 * @param {string} textToInsert
 * @param {TextSelection} selection
 * @param {boolean} selectInsertion {boolean} Whether or not the inserted text should be selected
 * @returns
 */
export function insertBefore(
  originalText,
  textToInsert,
  selection,
  selectInsertion = true
) {
  const textInsertion = insertText(originalText, textToInsert, selection.start)
  const newSelection = {
    start: selectInsertion
      ? selection.start
      : selection.start + textInsertion.insertionLength,
    end: selection.end + textInsertion.insertionLength,
  }
  return { ...textInsertion, newSelection }
}

/**
 * Inserts the given text after. The selection will change to encompass the new text
 *
 * @export
 * @param {string} originalText
 * @param {string} textToInsert
 * @param {TextSelection} selection
 * @returns
 */
export function insertAfter(originalText, textToInsert, selection) {
  const textInsertion = insertText(originalText, textToInsert, selection.end)
  const newSelection = {
    start: selection.start,
    end: selection.end + textInsertion.insertionLength,
  }
  return { ...textInsertion, newSelection }
}

/**
 * Helper for creating a command that makes a header
 * @param {any} text
 * @param {string} selection
 * @param {any} insertionBefore
 * @returns
 */
export function makeHeader({ text, selection }, insertionBefore) {
  selection = selectWordIfCaretIsInsideOne({ text, selection })
  // the user is selecting a word section
  const insertionText = insertBefore(text, insertionBefore, selection, false)
  const { newText, newSelection } = insertionText
  return {
    text: newText,
    selection: newSelection,
  }
}

/**
 *  Gets the number of line-breaks that would have to be inserted before the given 'startPosition'
 *  to make sure there's an empty line between 'startPosition' and the previous text
 */
export function getBreaksNeededForEmptyLineBefore(text = '', startPosition) {
  if (startPosition === 0) return 0

  // rules:
  // - If we're in the first line, no breaks are needed
  // - Otherwise there must be 2 breaks before the previous character. Depending on how many breaks exist already, we
  //      may need to insert 0, 1 or 2 breaks

  let neededBreaks = 2
  let isInFirstLine = true
  for (let i = startPosition - 1; i >= 0 && neededBreaks >= 0; i -= 1) {
    switch (text.charCodeAt(i)) {
      case 32: // blank space
        continue
      case 10: // line break
        neededBreaks -= 1
        isInFirstLine = false
        break
      default:
        return neededBreaks
    }
  }
  return isInFirstLine ? 0 : neededBreaks
}

/**
 * Inserts breaks before, only if needed. The returned selection will not include this breaks
 *
 * @export
 * @param {any} text
 * @param {any} selection
 * @returns
 */
export function insertBreaksBeforeSoThatThereIsAnEmptyLineBefore({
  text,
  selection,
}) {
  const breaksNeededBefore = getBreaksNeededForEmptyLineBefore(
    text,
    selection.start
  )
  const insertionBefore = Array(breaksNeededBefore + 1).join('\n')

  let newText = text
  let newSelection = selection
  let insertionLength = 0

  // if line-breaks have to be added before
  if (insertionBefore) {
    const textInsertion = insertText(text, insertionBefore, selection.start)
    newText = textInsertion.newText
    insertionLength = textInsertion.insertionLength
    newSelection = {
      start: selection.start + textInsertion.insertionLength,
      end: selection.end + textInsertion.insertionLength,
    }
  }
  return {
    newText,
    insertionLength,
    newSelection,
  }
}

/**
 *  Gets the number of line-breaks that would have to be inserted after the given 'startPosition'
 *  to make sure there's an empty line between 'startPosition' and the next text
 */
export function getBreaksNeededForEmptyLineAfter(text = '', startPosition) {
  if (startPosition === text.length - 1) return 0

  // rules:
  // - If we're in the first line, no breaks are needed
  // - Otherwise there must be 2 breaks before the previous character. Depending on how many breaks exist already, we
  //      may need to insert 0, 1 or 2 breaks

  let neededBreaks = 2
  let isInLastLine = true
  for (let i = startPosition; i < text.length && neededBreaks >= 0; i += 1) {
    switch (text.charCodeAt(i)) {
      case 32:
        continue
      case 10: {
        neededBreaks -= 1
        isInLastLine = false
        break
      }
      default:
        return neededBreaks
    }
  }
  return isInLastLine ? 0 : neededBreaks
}

/**
 * Inserts breaks after, only if needed. The returned selection will not include this breaks
 *
 * @export
 * @returns
 * @param markdownState
 */
export function insertBreaksAfterSoThatThereIsAnEmptyLineAfter({
  text,
  selection,
}) {
  const breaksNeededBefore = getBreaksNeededForEmptyLineAfter(
    text,
    selection.end
  )
  const insertionAfter = Array(breaksNeededBefore + 1).join('\n')

  let newText = text
  let insertionLength = 0

  // if line-breaks have to be added before
  if (insertionAfter) {
    const textInsertion = insertText(text, insertionAfter, selection.end)
    newText = textInsertion.newText
    insertionLength = textInsertion.insertionLength
  }
  return {
    newText,
    insertionLength,
    newSelection: selection,
  }
}

/**
 * Inserts insertionString before each line
 */
export function insertBeforeEachLine(text, insertion, selection) {
  const substring = text.slice(selection.start, selection.end)
  const lines = substring.split(/\n/)

  let insertionLength = 0
  const modifiedText = lines
    .map((item, index) => {
      if (typeof insertion === 'string') {
        insertionLength += insertion.length
        return insertion + item
      }
      if (typeof insertion === 'function') {
        const insertionResult = insertion(item, index)
        insertionLength += insertionResult.length
        return insertion(item, index) + item
      }
      throw Error('insertion is expected to be either a string or a function')
    })
    .join('\n')

  const newText =
    text.slice(0, selection.start) + modifiedText + text.slice(selection.end)
  return {
    newText,
    insertionLength,
    newSelection: {
      start:
        lines.length > 1 ? selection.start : selection.start + insertionLength,
      end: selection.end + insertionLength,
    },
  }
}

/**
 * Helper for creating commands that make lists
 * @export
 * @param markdownState
 * @param {any} insertionBeforeEachLine
 * @returns
 */
export function makeList({ text, selection }, insertionBeforeEachLine) {
  let textInsertion

  selection = selectWordIfCaretIsInsideOne({ text, selection })

  // insert breaks before, if needed
  textInsertion = insertBreaksBeforeSoThatThereIsAnEmptyLineBefore({
    text,
    selection,
  })
  text = textInsertion.newText
  selection = textInsertion.newSelection

  // insert breaks after, if needed
  textInsertion = insertBreaksAfterSoThatThereIsAnEmptyLineAfter({
    text,
    selection,
  })
  text = textInsertion.newText
  selection = textInsertion.newSelection

  // inserts 'insertionBeforeEachLine' before each line
  textInsertion = insertBeforeEachLine(text, insertionBeforeEachLine, selection)
  text = textInsertion.newText
  selection = textInsertion.newSelection

  return {
    text,
    selection,
  }
}
