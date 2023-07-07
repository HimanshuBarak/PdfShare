import { React, useState, useEffect } from "react";
import { firestore, auth } from "../firebase/setup";
import {
  collection,
  query,
  where,
  limit,
  getDocs,
  getDoc,
  setDoc,
  doc,
} from "firebase/firestore";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { constants } from "../../constants/generic_constants";
import { Link } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function DisplayFiles() {
  const [files, setFiles] = useState([]);
  const [newFile, setnewFile] = useState("");
  const [trigger, setTrigger] = useState(false);
  const [sharedFile, setSharedFile] = useState("");
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(auth.currentUser);

  const userFilesCollection = collection(
    firestore,
    constants.USER_COLLECTION_NAME
  );
  const fileCollection = collection(firestore, constants.FILE_COLLECTION_NAME);

  const readFiles = async () => {
    
   
    const docRef = doc(firestore, constants.USER_COLLECTION_NAME, user.email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const fileIds = data.fileIds;
      const q = query(fileCollection, where("fileId", "in", fileIds));
      const querySnap = await getDocs(q);

      const fetchedFiles = [];
      querySnap.forEach((doc) => {
        fetchedFiles.push(doc.data());
      });
      setFiles(fetchedFiles);
    }
  };

  const handleChange = (e) => {
    setnewFile(e.target.value);
  };

  const addFileforUser = async (fileId) => {
    const user = auth.currentUser;
    const docRef = doc(firestore, constants.USER_COLLECTION_NAME, user.email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const fileIds = data.fileIds;
      fileIds.push(fileId);
      await setDoc(
        docRef,
        {
          fileIds: fileIds,
        },
        { merge: true }
      );
    } else {
      console.log("No such document!");
    }
  };

  const addFile = async () => {
    let fileId;
    try {
      const querySnap = await getDocs(
        query(fileCollection, where("accessLink", "==", newFile), limit(1))
      );
      const docRef = querySnap.docs[0].ref;
      const documentSnapshot = await getDoc(docRef);
      const data = documentSnapshot.data();
      fileId = data.fileId;
    } catch (err) {
      console.log(err);
    }
    addFileforUser(fileId);
    setnewFile("");
    setTrigger(!trigger);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const shareFile = async (fId) => {
    const docRef = doc(firestore, constants.FILE_COLLECTION_NAME, fId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setSharedFile(data.accessLink);
      setOpen(true);
      console.log(sharedFile);
    } else {
      console.log("No such document!");
    }
  };

  // we will trigger the useEffect when the user is changed or when the files array is changed
  useEffect(() => {
    readFiles();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
   
  }, [trigger, addFile]);

  return (
    <div className="mt-8 ">
      <div className="flex items-center justify-center">
        <input
          onChange={handleChange}
          value={newFile}
          name="file"
          type="text"
          required="true"
          className={
            "max-w-md rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
          }
          placeholder="Enter the unique url of the file to access it"
        />
        <button
          type="button"
          onClick={addFile}
          className="group relative ml-5 w-50 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-500"
        >
          Add New File
        </button>
      </div>
      <div className="flex items-center justify-center">
        <table className="mt-8 w-[94] divide-y divide-gray-200">
          <caption className="text-2xl font-bold my-4">Your File List </caption>
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                File Name
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                View Pdf
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Share File
              </th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => {
              return (
                <tr key={file.id}>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {file.fileName}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <Link
                      to={`/view?fileId=${encodeURIComponent(
                        file.fileId
                      )}&link=${encodeURIComponent(file.downloadUrl)}`}
                    >
                      <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                        View Pdf
                      </button>
                    </Link>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <button
                      onClick={() => shareFile(file.fileId)}
                      className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      Share File
                    </button>
                    <Snackbar
                      anchorOrigin={{ vertical: "top", horizontal: "center" }}
                      open={open}
                      autoHideDuration={20000}
                      onClose={handleClose}
                    >
                      <Alert
                        onClose={handleClose}
                        severity="info"
                        sx={{ width: "100%" }}
                        className="bg-purple-400"
                      >
                        <div className="flex items-center">
                          <div>{`File Access Link : ${sharedFile}`}</div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="ml-2 px-2 py-1 bg-purple-600 rounded-md hover:bg-purple-700 text-white rounded-md hover:bg-gray-300 focus:outline-none"
                          >
                            <CopyToClipboard text={sharedFile}>
                              <span className="cursor-pointer">Copy</span>
                            </CopyToClipboard>
                          </button>
                        </div>
                      </Alert>
                    </Snackbar>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DisplayFiles;
