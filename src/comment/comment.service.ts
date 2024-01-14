import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { BlogService } from 'src/blog/blog.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    private readonly blogService: BlogService,
  ) {}

  async getByIdAsync(id: string): Promise<Comment> {
    return await this.commentRepository.findOneBy({ id });
  }

  async createAsync(createCommentDto: CreateCommentDto): Promise<Comment> {
    const blog = await this.blogService.findOneById(createCommentDto.blogId);

    if (!blog) {
      throw new Error('Blog not found');
    }

    const newComment = this.commentRepository.create({
      blog,
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
    const blog = await this.blogService.findOneById(blogId);

    if (!blog) {
      throw new Error('Blog not found');
    }

    const comments = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoin('comment.blog', 'blog')
      .where('blog.id = :blogId', { blogId })
      .getMany();

    return comments;
  }

  async removeAsync(id: string): Promise<void> {
    const comment = await this.getByIdAsync(id);

    await this.commentRepository.remove(comment);
  }
}
