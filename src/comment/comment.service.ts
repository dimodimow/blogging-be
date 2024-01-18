import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { BlogService } from 'src/blog/blog.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UserService } from 'src/user/user.service';
import { EntityNotFoundException } from 'src/utils/exceptions/entity-not-found.exception';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    private readonly blogService: BlogService,
    private readonly userService: UserService,
  ) {}

  async getByIdAsync(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOneBy({ id });

    if (!comment) {
      throw new EntityNotFoundException('Comment', 'id', id);
    }

    return comment;
  }

  async createAsync(
    createCommentDto: CreateCommentDto,
    userId: string,
  ): Promise<Comment> {
    const user = await this.userService.findOneByIdAsync(userId);

    const blog = await this.blogService.findOneByIdAsync(
      createCommentDto.blogId,
    );

    if (!blog) {
      throw new Error('Blog not found');
    }

    const newComment = this.commentRepository.create({
      blog,
      user,
      content: createCommentDto.content,
    });

    await this.commentRepository.save(newComment);
    return newComment;
  }

  async updateAsync(id: string, content: string): Promise<Comment> {
    const comment = await this.getByIdAsync(id);

    if (!comment) {
      throw new Error('Comment not found');
    }

    comment.content = content;
    comment.modifiedOn = new Date();

    await this.commentRepository.save(comment);

    return comment;
  }

  async getByBlogIdAsync(blogId: string) {
    const blog = await this.blogService.findOneByIdAsync(blogId);

    if (!blog) {
      throw new Error('Blog not found');
    }

    const comments = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoin('comment.blog', 'blog')
      .leftJoinAndSelect('comment.user', 'user')
      .where('blog.id = :blogId', { blogId })
      .getMany();

    return comments;
  }

  async removeAsync(id: string): Promise<void> {
    const comment = await this.getByIdAsync(id);

    await this.commentRepository.remove(comment);
  }
}
