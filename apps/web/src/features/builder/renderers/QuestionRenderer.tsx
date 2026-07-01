import type { RendererProps } from './types'
import { FillBlankRenderer } from './FillBlankRenderer'
import { FileUploadRenderer } from './FileUploadRenderer'
import { LongAnswerRenderer } from './LongAnswerRenderer'
import { MatchingRenderer } from './MatchingRenderer'
import { MCQMultipleRenderer } from './MCQMultipleRenderer'
import { MCQSingleRenderer } from './MCQSingleRenderer'
import { NumericalRenderer } from './NumericalRenderer'
import { OrderingRenderer } from './OrderingRenderer'
import { ShortAnswerRenderer } from './ShortAnswerRenderer'
import { TrueFalseRenderer } from './TrueFalseRenderer'

export function QuestionRenderer(props: RendererProps) {
  switch (props.question.type) {
    case 'MCQ_SINGLE':
      return <MCQSingleRenderer {...props} />
    case 'MCQ_MULTIPLE':
      return <MCQMultipleRenderer {...props} />
    case 'TRUE_FALSE':
      return <TrueFalseRenderer {...props} />
    case 'SHORT_ANSWER':
      return <ShortAnswerRenderer {...props} />
    case 'LONG_ANSWER':
      return <LongAnswerRenderer {...props} />
    case 'FILL_BLANK':
      return <FillBlankRenderer {...props} />
    case 'MATCHING':
      return <MatchingRenderer {...props} />
    case 'ORDERING':
      return <OrderingRenderer {...props} />
    case 'NUMERICAL':
      return <NumericalRenderer {...props} />
    case 'FILE_UPLOAD':
      return <FileUploadRenderer {...props} />
  }
}
