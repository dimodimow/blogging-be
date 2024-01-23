import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { BlogService } from 'src/blog/blog.service';
import { CommentRequestDto } from './dto/comment-request.dto';
import { UserService } from 'src/user/user.service';
import { EntityNotFoundException } from 'src/utils/exceptions/entity-not-found.exception';
import { COMMENT } from 'src/utils/constants/exception.constants';
import { CommentDto } from './dto/comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    private readonly blogService: BlogService,
    private readonly userService: UserService,
  ) {}

  async findByIdAsync(id: string): Promise<Comment> {
    const comment = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .where('comment.id = :id', { id })
      .getOne();

    if (!comment) {
      throw new EntityNotFoundException(COMMENT, 'id', id);
    }

    return comment;
  }

  async createAsync(
    commentRequestDto: CommentRequestDto,
    userId: string,
    blogId: string,
  ): Promise<CommentDto> {
    const user = await this.userService.findOneByIdAsync(userId);

    const blog = await this.blogService.findOneByIdAsync(blogId);

    const newComment = this.commentRepository.create({
      blog,
      user,
      content: commentRequestDto.content,
    });

    await this.commentRepository.save(newComment);
    return new CommentDto(newComment);
  }

  async updateAsync(
    id: string,
    commentRequestDto: CommentRequestDto,
  ): Promise<CommentDto> {
    const comment = await this.findByIdAsync(id);

    comment.content = commentRequestDto.content;
    comment.modifiedOn = new Date();

    await this.commentRepository.save(comment);

    return new CommentDto(comment);
  }

  async findByBlogIdAsync(blogId: string): Promise<CommentDto[]> {
    const comments = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoin('comment.blog', 'blog')
      .leftJoinAndSelect('comment.user', 'user.username')
      .where('blog.id = :blogId', { blogId })
      .getMany();

    return comments?.map((comment) => new CommentDto(comment));
  }

  async removeAsync(id: string): Promise<void> {
    const comment = await this.findByIdAsync(id);

    await this.commentRepository.remove(comment);
  }
}
