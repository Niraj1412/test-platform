import type { EditorProps } from './types'
import { FileUploadEditor } from './FileUploadEditor'
import { FillBlankEditor } from './FillBlankEditor'
import { LongAnswerEditor } from './LongAnswerEditor'
import { MatchingEditor } from './MatchingEditor'
import { MCQMultipleEditor } from './MCQMultipleEditor'
import { MCQSingleEditor } from './MCQSingleEditor'
import { NumericalEditor } from './NumericalEditor'
import { OrderingEditor } from './OrderingEditor'
import { ShortAnswerEditor } from './ShortAnswerEditor'
import { TrueFalseEditor } from './TrueFalseEditor'

export function QuestionEditor(props: EditorProps) {
  switch (props.value.type) {
    case 'MCQ_SINGLE':
      return <MCQSingleEditor {...props} />
    case 'MCQ_MULTIPLE':
      return <MCQMultipleEditor {...props} />
    case 'TRUE_FALSE':
      return <TrueFalseEditor {...props} />
    case 'SHORT_ANSWER':
      return <ShortAnswerEditor {...props} />
    case 'LONG_ANSWER':
      return <LongAnswerEditor {...props} />
    case 'FILL_BLANK':
      return <FillBlankEditor {...props} />
    case 'MATCHING':
      return <MatchingEditor {...props} />
    case 'ORDERING':
      return <OrderingEditor {...props} />
    case 'NUMERICAL':
      return <NumericalEditor {...props} />
    case 'FILE_UPLOAD':
      return <FileUploadEditor {...props} />
  }
}
