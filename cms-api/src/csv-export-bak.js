const Container = await getContainer();
const PostRepository = Container.resolve('PostRepository');
const UserRepository = Container.resolve('UserRepository');
const UserModel = Container.resolve('UserModel');

console.log('Getting entries... \n');

const posts = await PostRepository.getAll({
  where: {
    status: {
      [Op.and]: [
        { [Op.ne]: 'initial' },
      ],
    },
    isActive: 1,
  },
  include: [
    {
      model: UserModel,
      as: 'user',
      attributes: {
        exclude: ['password'],
      },
    },
  ],
});

const fields = [
  'Post Id',
  'Title',
  'Content',
  'Source',
  'Category',
  'Author',
  'Editor',
  'Writer',
  'Location',
  'Tags Original',
  'Tags Retained',
  'Tags Added',
  'Tags Removed',
  'Status',
  'Scheduled Date',
  'Published Date',
  'Created Date',
  'Updated Date',
];

const opts = { fields };
const entries = [];

await Promise.all(
  posts.map(async (post) => {
    const {
      postId,
      title: Title,
      content: Content,
      source: Source,
      category: Category,
      contributors,
      locationAddress: Location,
      tagsOriginal,
      tagsRetained,
      tagsAdded,
      tagsRemoved,
      status: Status,
      scheduledAt,
      publishedAt,
      createdAt,
      updatedAt,
    } = post;

    // get post writer
    let writer = '';
    if (contributors && 'writers' in contributors && contributors.writers.length && 'id' in contributors.writers[0]) {
      const wr = await UserRepository.getUserById(contributors.writers[0].id);
      writer = `${wr.firstName} ${wr.lastName}`;
    }

    // get post editor
    let editor = '';
    if (contributors && 'editor' in contributors && contributors.editor && 'id' in contributors.editor) {
      const ed = await UserRepository.getUserById(contributors.editor.id);
      editor = `${ed.firstName} ${ed.lastName}`;
    }

    function formatTags(tags) {
      const tagsFr = [];
      if (tags) {
        tags.forEach((tag) => {
          tagsFr.push(tag[0]);
        });
      }

      return tagsFr;
    }

    const entry = {
      'Post Id': postId,
      Title,
      Content,
      Source,
      Category,
      Author: `${post.user.firstName} ${post.user.lastName}`,
      Writer: writer,
      Editor: editor,
      Location,
      'Tags Original': formatTags(tagsOriginal).join(', '),
      'Tags Retained': formatTags(tagsRetained).join(', '),
      'Tags Added': formatTags(tagsAdded).join(', '),
      'Tags Removed': formatTags(tagsRemoved).join(', '),
      Status,
      'Scheduled Date': scheduledAt,
      'Published Date': publishedAt,
      'Created Date': createdAt,
      'Updated Date': updatedAt,
    };

    entries.push(entry);

    console.log(Title);
  }),
);

const s3 = new AWS.S3();
const Bucket = process.env.BUCKET_NAME;

try {
  const parser = new Parser(opts);
  const csv = await parser.parse(entries);

  await fs.writeFile('posts.csv', csv);
  const Body = await fs.createWriteStream('posts.csv');

  const res = await s3.putObject({
    Key: 'csv_export',
    Bucket,
    Body,
  });

  console.log(res);
} catch (error) {
  console.log(error);
}

return 'success';