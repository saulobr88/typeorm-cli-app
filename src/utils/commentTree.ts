// src/utils/commentTree.ts
import { Comment } from '../entities/Comment';

export function printComments(comments: Comment[], indent = 0) {
  const pad = ' '.repeat(indent);
  comments.forEach(c => {
    console.log(`${pad}- [${c.id}] ${c.content}`);
    if (c.children?.length) printComments(c.children, indent + 2);
  });
}
