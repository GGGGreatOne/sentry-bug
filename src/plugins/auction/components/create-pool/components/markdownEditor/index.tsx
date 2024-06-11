import Editor from 'react-markdown-editor-lite'
import ReactMarkdown from 'react-markdown'
import 'react-markdown-editor-lite/lib/index.css'
import { useRef } from 'react'
import { Box, styled } from '@mui/material'

const EditorContainer = styled(Box)`
  &.dark {
    .rc-md-editor {
      border-radius: 4px;
      border: 0.938px solid #2c2c2c;
      background: #1b1b1b !important;
      .rc-md-navigation {
        background: var(--text-10, rgba(255, 255, 229, 0.1)) !important;
        padding: 11.251px 7.501px 11.251px 22.503px;
        border-bottom: none;
        .button-wrap .button {
          color: #ffffe5;
        }
      }
      .section-container {
        background: #1c1c19 !important;
        &.input,
        & .custom-html-style {
          color: #959595;
          font-family: 'SF Pro Display';
          font-size: 15.002px;
          font-style: normal;
          font-weight: 400;
          line-height: 140%; /* 21.003px */
        }
      }
    }
  }
`

const MarkdownEditor = ({
  value,
  setEditorValue,
  placeholder,
  style
}: {
  value: string
  setEditorValue(val: string): void
  placeholder: string
  style?: React.CSSProperties
}) => {
  const mdEditor = useRef<Editor>(null)

  const handleEditorChange = ({ text }: { text: any }) => {
    setEditorValue(`${text}`)
  }
  return (
    <EditorContainer className="dark">
      <Editor
        ref={mdEditor}
        value={value}
        style={{
          width: '100%',
          height: '350px',
          ...style
        }}
        imageAccept=".jpeg,.png,.webp"
        onChange={handleEditorChange}
        placeholder={placeholder}
        shortcuts={true}
        view={{ html: false, menu: true, md: true }}
        renderHTML={text => {
          // eslint-disable-next-line react/no-children-prop
          return <ReactMarkdown children={text} />
        }}
      />
    </EditorContainer>
  )
}
export default MarkdownEditor
