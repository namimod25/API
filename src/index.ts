import 'dotenv/config';
import userRouter from './router/user.route.js';
import followRouter from './router/follow.route.js';
import FeedRouter from './router/feed.route.js';
import routeComment from './router/comment.route.js';
import LikeRouter from './router/like.route.js';
import BookmarkRouter from './router/bookmark.route.js';

async function bootstrap() {
  const express = (await import('express')).default;
  const cors = (await import('cors')).default;
  const { default: router } = await import('./router/Auth.route.js');
  await import('./db/config.js');

  const app = express();
  const port = 5030;

  app.use(cors());
  app.use(express.json());

  app.use('/api/auth', router);
  app.use('/api/user', userRouter);
  app.use('/api/follow', followRouter);
  app.use('/api/feed', FeedRouter);
  app.use('/api/comment', routeComment);
  app.use('/api/like', LikeRouter);
  app.use('/api/bookmark', BookmarkRouter);

  app.listen(port, () => {
    console.log(`API running at http://localhost:${port}`);
  });
}

bootstrap().catch((err) => {
  console.error('BOOTSTRAP ERROR:', err);
  process.exit(1);
});