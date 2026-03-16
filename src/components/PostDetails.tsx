import React, { useEffect, useState } from 'react';
import { Loader } from './Loader';
import { NewCommentForm } from './NewCommentForm';
import { Post } from '../types/Post';
import { Comment } from '../types/Comment';
import * as services from '../api';

type Props = {
  post: Post;
};

export const PostDetails: React.FC<Props> = ({ post }) => {
  const [isProcessed, setisProcessed] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isFormVisible, setIsFromVosoble] = useState(false);
  const [error, setError] = useState('');
  const { title, id: postId, body } = post;

  useEffect(() => {
    setisProcessed(true);
    setIsFromVosoble(false);

    services
      .getComments(postId)
      .then(setComments)
      .catch(() => setError('Something went wrong'))
      .finally(() => {
        setisProcessed(false);
      });
  }, [postId]);

  function handleDeleteComment(commentId: number) {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
    services.deleteComment(commentId);
  }

  async function handleCreateComment(newComment: Comment) {
    return services.createNewComment(newComment).finally(() => {
      setComments(prev => [...prev, newComment]);
    });
  }

  return (
    <div className="content" data-cy="PostDetails">
      <div className="block">
        <h2 data-cy="PostTitle">{`#${postId}: ${title}`}</h2>

        <p data-cy="PostBody">{body}</p>
      </div>

      <div className="block">
        {isProcessed ? (
          <Loader />
        ) : (
          <>
            {error ? (
              <div className="notification is-danger" data-cy="CommentsError">
                {error}
              </div>
            ) : null}

            {comments.length === 0 && !error && (
              <p className="title is-4" data-cy="NoCommentsMessage">
                No comments yet
              </p>
            )}

            <p className="title is-4">Comments:</p>
            {comments.map(comment => (
              <article
                key={comment.id}
                className="message is-small"
                data-cy="Comment"
              >
                <div className="message-header">
                  <a href={`mailto:${comment.email}`} data-cy="CommentAuthor">
                    {comment.name}
                  </a>
                  <button
                    data-cy="CommentDelete"
                    type="button"
                    className="delete is-small"
                    aria-label="delete"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    delete button
                  </button>
                </div>

                <div className="message-body" data-cy="CommentBody">
                  {comment.body}
                </div>
              </article>
            ))}

            {!isFormVisible && !error && (
              <button
                data-cy="WriteCommentButton"
                type="button"
                className="button is-link"
                onClick={() => setIsFromVosoble(true)}
              >
                Write a comment
              </button>
            )}
          </>
        )}
      </div>

      {isFormVisible && (
        <NewCommentForm postId={postId} onSubmit={handleCreateComment} />
      )}
    </div>
  );
};
