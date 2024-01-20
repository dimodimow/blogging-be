import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { BusinessException } from 'src/utils/exceptions/business.exception';
import UploadFileDto from './dto/upload-file.dto';
import { UserService } from 'src/user/user.service';
import { EntityNotFoundException } from 'src/utils/exceptions/entity-not-found.exception';
import { BlogService } from 'src/blog/blog.service';
import { FileService } from 'src/file/file.service';
import { CreateFileDto } from 'src/file/dto/create-file.dto';
import {
  ERROR_UPLOADING_FILE_TO_S3,
  USER,
} from 'src/utils/constants/exception.constants';

@Injectable()
export class S3Service {
  constructor(
    private readonly userService: UserService,
    private readonly blogService: BlogService,
    private readonly fileService: FileService,
  ) {}

  private readonly s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  private readonly S3_BUCKET_URL = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com`;

  async uploadFileAsync(
    uploadFileDto: UploadFileDto,
    username: string,
    blogId: string,
  ): Promise<void> {
    const blog = await this.blogService.findOneByIdAsync(blogId);

    const user = await this.userService.findByUsernameAsync(username);

    if (!user) {
      throw new EntityNotFoundException(USER, 'username', username);
    }

    const { name, buffer, mimeType } = uploadFileDto;

    const blogTitle = blog.title.replace(' ', '-');

    const filePath = `${user.username}/${blogTitle}/${name}`;

    const { $metadata } = await this.s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filePath,
        Body: buffer,
        ContentType: mimeType,
      }),
    );

    if ($metadata.httpStatusCode !== 200) {
      throw new BusinessException(ERROR_UPLOADING_FILE_TO_S3);
    }

    const fileUrl = `${this.S3_BUCKET_URL}/${filePath}`;

    const file = await this.fileService.create(
      new CreateFileDto(fileUrl, name),
    );

    await this.blogService.addFileToBlogAsync(file, blog);
  }
}
