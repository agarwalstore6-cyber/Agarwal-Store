/* =========================================================
   AGARWAL STORE
   CODE 10 — FIRESTORE DATABASE FOUNDATION
   ========================================================= */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


/* =========================================================
   FIREBASE DATABASE
   ========================================================= */

const db =
  window.AgarwalFirebase?.db;


/* =========================================================
   DATABASE CHECK
   ========================================================= */

function checkDatabase() {

  if (!db) {

    throw new Error(
      "Agarwal Store: Firebase Firestore is not ready."
    );

  }

}


/* =========================================================
   COLLECTION REFERENCE
   ========================================================= */

function getCollection(
  collectionName
) {

  checkDatabase();

  return collection(
    db,
    collectionName
  );

}


/* =========================================================
   DOCUMENT REFERENCE
   ========================================================= */

function getDocument(
  collectionName,
  documentId
) {

  checkDatabase();

  return doc(
    db,
    collectionName,
    documentId
  );

}


/* =========================================================
   GET ONE DOCUMENT
   ========================================================= */

async function getDocumentData(
  collectionName,
  documentId
) {

  const documentReference =
    getDocument(
      collectionName,
      documentId
    );

  const snapshot =
    await getDoc(
      documentReference
    );


  if (!snapshot.exists()) {

    return null;

  }


  return {

    id: snapshot.id,

    ...snapshot.data()

  };

}


/* =========================================================
   GET COLLECTION
   ========================================================= */

async function getCollectionData(
  collectionName
) {

  const collectionReference =
    getCollection(
      collectionName
    );

  const snapshot =
    await getDocs(
      collectionReference
    );


  return snapshot.docs.map(
    document => ({

      id: document.id,

      ...document.data()

    })
  );

}


/* =========================================================
   ADD DOCUMENT
   ========================================================= */

async function addDocument(
  collectionName,
  data
) {

  const collectionReference =
    getCollection(
      collectionName
    );


  const documentData = {

    ...data,

    createdAt:
      serverTimestamp(),

    updatedAt:
      serverTimestamp()

  };


  const documentReference =
    await addDoc(
      collectionReference,
      documentData
    );


  return documentReference.id;

}


/* =========================================================
   CREATE OR REPLACE DOCUMENT
   ========================================================= */

async function setDocument(
  collectionName,
  documentId,
  data
) {

  const documentReference =
    getDocument(
      collectionName,
      documentId
    );


  await setDoc(

    documentReference,

    {

      ...data,

      updatedAt:
        serverTimestamp()

    },

    {
      merge: true
    }

  );


  return documentId;

}


/* =========================================================
   UPDATE DOCUMENT
   ========================================================= */

async function updateDocument(
  collectionName,
  documentId,
  data
) {

  const documentReference =
    getDocument(
      collectionName,
      documentId
    );


  await updateDoc(

    documentReference,

    {

      ...data,

      updatedAt:
        serverTimestamp()

    }

  );


  return documentId;

}


/* =========================================================
   DELETE DOCUMENT
   ========================================================= */

async function deleteDocument(
  collectionName,
  documentId
) {

  const documentReference =
    getDocument(
      collectionName,
      documentId
    );


  await deleteDoc(
    documentReference
  );


  return true;

}


/* =========================================================
   QUERY DOCUMENTS
   ========================================================= */

async function findDocuments(
  collectionName,
  field,
  operator,
  value
) {

  const collectionReference =
    getCollection(
      collectionName
    );


  const databaseQuery =
    query(

      collectionReference,

      where(
        field,
        operator,
        value
      )

    );


  const snapshot =
    await getDocs(
      databaseQuery
    );


  return snapshot.docs.map(
    document => ({

      id: document.id,

      ...document.data()

    })
  );

}


/* =========================================================
   ORDERED COLLECTION
   ========================================================= */

async function getLatestDocuments(
  collectionName,
  field = "createdAt",
  maximum = 20
) {

  const collectionReference =
    getCollection(
      collectionName
    );


  const databaseQuery =
    query(

      collectionReference,

      orderBy(
        field,
        "desc"
      ),

      limit(
        maximum
      )

    );


  const snapshot =
    await getDocs(
      databaseQuery
    );


  return snapshot.docs.map(
    document => ({

      id: document.id,

      ...document.data()

    })
  );

}


/* =========================================================
   PUBLIC FIRESTORE API
   ========================================================= */

window.AgarwalFirestore = {

  getCollection,

  getDocument,

  getDocumentData,

  getCollectionData,

  addDocument,

  setDocument,

  updateDocument,

  deleteDocument,

  findDocuments,

  getLatestDocuments

};


/* =========================================================
   FIRESTORE READY
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:firestore-ready"
  )

);
