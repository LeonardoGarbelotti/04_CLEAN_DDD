import { Either, left, right } from '@/core/either'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

interface DeleteQuestionOnCommentUseCaseRequest {
  authorId: string
  questionCommentId: string
}

type DeleteQuestionOnCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  object
>

export class DeleteQuestionOnCommentUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) { }

  async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionOnCommentUseCaseRequest): Promise<DeleteQuestionOnCommentUseCaseResponse> {
    const questionComment =
      await this.questionCommentsRepository.findById(questionCommentId)

    if (!questionComment) {
      return left(new ResourceNotFoundError())
    }

    if (questionComment.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    await this.questionCommentsRepository.delete(questionComment)

    return right({})
  }
}
