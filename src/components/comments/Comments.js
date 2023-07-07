import React, { useEffect, useState } from "react";
import { firestore, auth } from "../firebase/setup";
import {
  collection,
  query,
  where,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { constants } from "../../constants/generic_constants";

function Comments({ fileId }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [reply, setReply] = useState("");
  const [replies, setReplies] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [commentId, setCommentId] = useState("");

  const user = auth.currentUser;
  const [replyFormIndex, setReplyFormIndex] = useState(null);

  function extractUsername(email) {
    const atIndex = email.indexOf("@");
    const username = email.substring(0, atIndex);
    return username;
  }

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleReplyChange = (event) => {
    setReply(event.target.value);
  };

  function generateUniqueID() {
    const timestamp = Date.now().toString(36); // Convert timestamp to base 36
    const randomString = Math.random().toString(36).substr(2, 10); // Generate random string
    const uniqueID = timestamp + randomString; // Concatenate timestamp and random string

    return uniqueID;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle comment submission logic here
    await addDoc(collection(firestore, constants.COMMENTS_COLLECTION_NAME), {
      fileId: fileId,
      commentId: generateUniqueID(),
      text: comment,
      user: extractUsername(user.email),
      time: serverTimestamp(),
    });
    setTrigger(!trigger);
    //setComments([...comments, newComment]);
    setComment("");
  };
  const updateReplyIndex = (index, commentId) => {
    setReplyFormIndex(index);
    setCommentId(commentId);
  };
  const handleReplySubmit = async (e) => {
    e.preventDefault();

    await addDoc(collection(firestore, constants.REPLIES_COLLECTION_NAME), {
      fileId: fileId,
      commentId: commentId,
      text: reply,
      user: extractUsername(user.email),
      time: serverTimestamp(),
    });
    setTrigger(!trigger);
    //setComments([...comments, newComment]);
    setReply("");
  };
  const getComments = async () => {
    try {
      const q = query(
        collection(firestore, constants.COMMENTS_COLLECTION_NAME),
        where("fileId", "==", fileId)
      );
      const querySnap = await getDocs(q);
      const fetchedComments = [];
      querySnap.forEach((doc) => {
        fetchedComments.push(doc.data());
      });
      setComments(fetchedComments);
    } catch (e) {
      console.log(e);
    }
  };
  const getReplies = async () => {
    try {
      const q = query(
        collection(firestore, constants.REPLIES_COLLECTION_NAME),
        where("fileId", "==", fileId)
      );
      const querySnap = await getDocs(q);
      const fetchedReplies = [];
      querySnap.forEach((doc) => {
        fetchedReplies.push(doc.data());
      });
      setReplies(fetchedReplies);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getComments();
    getReplies();
  }, [trigger]);
  return (
    <div className="mt-8 text-left max-w-[66%] mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Leave a Comment</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="comment" className="block text-gray-700 font-medium">
            Your Comment:
          </label>
          <textarea
            id="comment"
            name="comment"
            className="mt-2 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            rows="4"
            value={comment}
            onChange={handleCommentChange}
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Submit
          </button>
        </div>
      </form>
      <div className="mt-6">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-center mb-2">
                <div className="flex items-center justify-center w-10 h-10 bg-purple-600 text-white rounded-full mr-2">
                  <span className="text-lg font-medium">
                    {comment.user.charAt(0)}
                  </span>
                </div>
                <div className="flex justify-between items-center flex-grow">
                  <p className="text-gray-700 font-medium">{comment.user}</p>
                  <p className="text-gray-500 text-sm">
                    {comment.time.toDate().toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="text-left">{comment.text}</p>

              <div className="flex justify-end">
                <button
                  className="text-purple-600 text-sm font-medium mt-1 focus:outline-none"
                  onClick={() => updateReplyIndex(index, comment.commentId)}
                >
                  Reply
                </button>
              </div>

              {replies.map(
                (reply, index) =>
                  reply.commentId === comment.commentId && (
                    <div key={index} className="ml-4 mt-2 mb-4 p-2">
                      <hr  className="mb-4"/>
                      <div className="flex items-center mb-2">
                        <div className="flex items-center justify-center w-10 h-10 bg-purple-600 text-white rounded-full mr-2">
                          <span className="text-lg font-medium">
                            {reply.user.charAt(0)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center flex-grow">
                          <p className="text-gray-700 font-medium">
                            {reply.user}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {reply.time.toDate().toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-left">{reply.text}</p>
                    </div>
                  )
              )}
              {replyFormIndex === index && (
                <form onSubmit={handleReplySubmit} className="mt-2 ml-4">
                  <div className="mb-4">
                    <label
                      htmlFor="reply"
                      className="block text-gray-700 font-medium"
                    >
                      Your Reply:
                    </label>
                    <textarea
                      id="reply"
                      name="relpy"
                      className="mt-2 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      rows="4"
                      value={reply}
                      onChange={handleReplyChange}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-2 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    Submit
                  </button>
                </form>
              )}
              {index !== comments.length - 1 && (
                <hr className="my-4 border-gray-300" />
              )}
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </div>
  );
}

export default Comments;
