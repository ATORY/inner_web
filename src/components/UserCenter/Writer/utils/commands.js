import {
  insertBefore,
  insertAfter,
  insertBeforeAndAfter,
  makeHeader,
  makeList,
  insertText,
  selectWordIfCaretIsInsideOne,
  insertBreaksBeforeSoThatThereIsAnEmptyLineBefore,
  insertBreaksAfterSoThatThereIsAnEmptyLineAfter,
} from './markdownUtil'
import { getMarkdownStateFromDraftState, buildNewDraftState } from './draftUtil'

export const blodCommand = {
  // buttonContentBuilder: ({ iconProvider }) => iconProvider('bold'),
  buttonProps: { 'aria-label': 'Add bold text' },
  execute: state => {
    let mdState = getMarkdownStateFromDraftState(state)
    mdState = insertBeforeAndAfter(mdState, '**')
    return buildNewDraftState(state, mdState)
  },
  keyCommand: 'bold',
}

export const italicCommand = {
  // buttonContentBuilder: ({ iconProvider }) => iconProvider("italic"),
  buttonProps: { 'aria-label': 'Add italic text' },
  execute: state => {
    let mdState = getMarkdownStateFromDraftState(state)
    mdState = insertBeforeAndAfter(mdState, '_')
    return buildNewDraftState(state, mdState)
  },
  keyCommand: 'italic',
}

function setHeader(state, str) {
  let mdState = getMarkdownStateFromDraftState(state)
  mdState = makeHeader(mdState, str)
  return buildNewDraftState(state, mdState)
}

export const headingCommand = {
  buttonProps: { 'aria-label': 'Add italic text' },
  execute: state => setHeader(state, '# '),
  keyCommand: 'italic',
}

export const strikethroughCommand = {
  buttonProps: { 'aria-label': 'Add strikethrough text' },

  execute: state => {
    let mdState = getMarkdownStateFromDraftState(state)
    mdState = insertBeforeAndAfter(mdState, '~~')
    return buildNewDraftState(state, mdState)
  },
}

export const linkCommand = {
  buttonProps: { 'aria-label': 'Insert a link' },

  execute: state => {
    const { text, selection } = getMarkdownStateFromDraftState(state)
    const newSelection = selectWordIfCaretIsInsideOne({ text, selection })
    const { newText, insertionLength } = insertText(
      text,
      '[',
      newSelection.start
    )
    const finalText = insertText(
      newText,
      '](url)',
      newSelection.end + insertionLength
    ).newText

    return buildNewDraftState(state, {
      text: finalText,
      selection: {
        start: newSelection.start + insertionLength,
        end: newSelection.end + insertionLength,
      },
    })
  },
}

export const quoteCommand = {
  buttonProps: { 'aria-label': 'Insert a quote' },

  execute: state => {
    let { text, selection } = getMarkdownStateFromDraftState(state)
    selection = selectWordIfCaretIsInsideOne({ text, selection })

    let textInsertion

    textInsertion = insertBreaksBeforeSoThatThereIsAnEmptyLineBefore({
      text,
      selection,
    })
    text = textInsertion.newText
    selection = textInsertion.newSelection

    textInsertion = insertBefore(text, '> ', selection, false)
    text = textInsertion.newText
    selection = textInsertion.newSelection

    textInsertion = insertBreaksAfterSoThatThereIsAnEmptyLineAfter({
      text,
      selection,
    })
    text = textInsertion.newText
    selection = textInsertion.newSelection

    return buildNewDraftState(state, { text, selection })
  },
}

export const codeCommand = {
  buttonContentBuilder: ({ iconProvider }) => iconProvider('code'),
  buttonProps: { 'aria-label': 'Insert code' },
  execute: state => {
    let { text, selection } = getMarkdownStateFromDraftState(state)
    selection = selectWordIfCaretIsInsideOne({ text, selection })

    // when there's no breaking line
    if (text.slice(selection.start, selection.end).indexOf('\n') === -1) {
      const mdState = insertBeforeAndAfter({ text, selection }, '`')
      return buildNewDraftState(state, mdState)
    }

    let textInsertion

    // insert breaks before, if needed
    textInsertion = insertBreaksBeforeSoThatThereIsAnEmptyLineBefore({
      text,
      selection,
    })
    text = textInsertion.newText
    selection = textInsertion.newSelection

    // inserts ```\n before
    textInsertion = insertBefore(text, '```\n', selection, false)
    text = textInsertion.newText
    selection = textInsertion.newSelection

    // inserts ```\n after
    textInsertion = insertAfter(text, '\n```', selection)
    text = textInsertion.newText
    selection = textInsertion.newSelection

    // insert breaks after, if needed
    textInsertion = insertBreaksAfterSoThatThereIsAnEmptyLineAfter({
      text,
      selection,
    })
    text = textInsertion.newText
    selection = textInsertion.newSelection

    return buildNewDraftState(state, { text, selection })
  },
  keyCommand: 'code',
}

export const unorderedListCommand = {
  buttonContentBuilder: ({ iconProvider }) => iconProvider('list-ul'),

  buttonProps: { 'aria-label': 'Insert a bulleted list' },

  execute: state => {
    let mdState = getMarkdownStateFromDraftState(state)
    mdState = makeList(mdState, '- ')
    return buildNewDraftState(state, mdState)
  },
}

export const orderedListCommand = {
  buttonContentBuilder: ({ iconProvider }) => iconProvider('list-ol'),

  buttonProps: { 'aria-label': 'Insert numbered list' },

  execute: state => {
    let mdState = getMarkdownStateFromDraftState(state)
    mdState = makeList(mdState, (item, index) => `${index + 1}. `)
    return buildNewDraftState(state, mdState)
  },
}

export const imageCommand = {
  buttonProps: { 'aria-label': 'Insert a picture' },

  execute: (state, { imageUrl = 'image-url' }) => {
    const { text, selection } = getMarkdownStateFromDraftState(state)
    const { newText, insertionLength } = insertText(text, '![', selection.start)
    const finalText = insertText(
      newText,
      `](${imageUrl})`,
      selection.end + insertionLength
    ).newText

    return buildNewDraftState(state, {
      text: finalText,
      selection: {
        start: selection.start + insertionLength,
        end: selection.end + insertionLength,
      },
    })
  },
}
