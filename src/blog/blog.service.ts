import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './blog.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogFilter } from './blog.filter';
import { TagService } from 'src/tag/tag.service';
import { PaginationDto } from 'src/base/dto/pagination.dto';
import { FindAllPaginatedResultDto } from '../base/dto/find-all-paginated-result.dto';
import { EntityNotFoundException } from 'src/utils/exceptions/entity-not-found.exception';
import { UserService } from 'src/user/user.service';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog) private blogRepository: Repository<Blog>,
    private readonly tagService: TagService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async createAsync(
    createBlogDto: CreateBlogDto,
    userId: string,
  ): Promise<Blog> {
    const user = await this.userService.findOneByIdAsync(userId);

    const newBlog = this.blogRepository.create(createBlogDto);

    if (createBlogDto.tagNames?.length > 0) {
      const tags = await this.tagService.getByNamesAsync(
        createBlogDto.tagNames,
      );
      newBlog.tags = tags;
    }

    newBlog.user = user;

    await this.blogRepository.save(newBlog);

    return newBlog;
  }

  async findOneByIdAsync(id: string): Promise<Blog> {
    const blog = await this.blogRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.comments', 'comment')
      .leftJoinAndSelect('blog.user', 'user')
      .leftJoinAndSelect('blog.tags', 'tag')
      .where('blog.id = :id', { id })
      .getOne();

    if (!blog) {
      throw new EntityNotFoundException('Blog', 'id', id);
    }

    return blog;
  }

  async updateAsync(id: string, updateBlogDto: UpdateBlogDto): Promise<Blog> {
    const blog = await this.findOneByIdAsync(id);
    const updatedBlog = this.blogRepository.merge(blog, updateBlogDto);

    if (updateBlogDto.tagNames?.length > 0) {
      const tags = await this.tagService.getByNamesAsync(
        updateBlogDto.tagNames,
      );
      updatedBlog.tags = tags;
    }

    updatedBlog.modifiedOn = new Date();

    await this.blogRepository.save(updatedBlog);

    return updatedBlog;
  }

  async findAll(
    blogFilter: BlogFilter,
    paginationDto: PaginationDto,
  ): Promise<FindAllPaginatedResultDto<Blog>> {
    const query = this.blogRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.comments', 'comment')
      .leftJoinAndSelect('blog.user', 'user')
      .leftJoinAndSelect('blog.tags', 'tag');

    this.filterBlogs(query, blogFilter);

    const { limit, page } =
      Object.keys(paginationDto).length === 0
        ? new PaginationDto()
        : paginationDto;

    if (limit && page) {
      query.skip((page - 1) * limit).take(limit);
    }

    const [blogs, count] = await query.getManyAndCount();

    const pagesLeft = Math.ceil(count / limit) - page;

    return new FindAllPaginatedResultDto<Blog>(blogs, count, pagesLeft);
  }

  async removeAsync(id: string): Promise<void> {
    const blog = await this.findOneByIdAsync(id);

    if (!blog) {
      throw new EntityNotFoundException('Blog', 'id', id);
    }

    await this.blogRepository.remove(blog);
  }

  private filterBlogs(
    queryBuilder: SelectQueryBuilder<Blog>,
    filter: BlogFilter,
  ): void {
    if (filter.title) {
      queryBuilder.andWhere('blog.title like :title', {
        title: `%${filter.title}%`,
      });
    }

    if (filter.username) {
      queryBuilder.andWhere('user.username ILIKE :username', {
        username: `%${filter.username}%`,
      });
    }

    if (filter.tags && Array.isArray(filter.tags)) {
      queryBuilder.andWhere('tag.name IN (:...tags)', { tags: filter.tags });
    } else if (filter.tags && [filter.tags].length === 1) {
      queryBuilder.andWhere('tag.name = :tag', { tag: filter.tags });
    }
  }
}
