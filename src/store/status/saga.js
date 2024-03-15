import { takeEvery, put, call, all, fork } from "redux-saga/effects";


// Login Redux States
import {
  DELETE_STATUS,GET_STATUS_ALL, SET_STATUS, UPDATE_STATUS,
} from "./actionTypes"
import {
  getStatusAllFail,
  getStatusAllSuccess,
  setStatusSuccess,
  setStatusFail,
  updateStatusSuccess,
  updateStatusFail,
  deleteStatusSuccess,
  deleteStatusFail
} from "./actions"

import { getStatusDataAll, addNewDataStatus, updateDataStatus, deleteDataStatus } from "../../helpers/fakebackend_helper";
import { toast } from "react-toastify";

function* fetStatusData() {
  try {
    const response = yield call(getStatusDataAll);
    yield put(getStatusAllSuccess(response));
  } catch (error) {
    yield put(getStatusAllFail(error))
  }
}

function* onAddNewStatus({ payload: data }) {
  try {
    const response = yield call(addNewDataStatus, data);
    yield put(setStatusSuccess(response));
    toast.success("Status Added Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(setStatusFail(error));
    toast.error("Status Added Failed", { autoClose: 2000 });
  }
}

function* onUpdateStatus({ payload: data }) {
  try {
    const response = yield call(updateDataStatus, data)
    yield put(updateStatusSuccess(response));
    toast.success("Status Updated Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(updateStatusFail(error))
    toast.error("Status Updated Failed", { autoClose: 2000 });
  }
}

function* onDeleteStatus({ payload: id }) {
  try {
    const response = yield call(deleteDataStatus, id)
    yield put(deleteStatusSuccess(response));
    toast.success("Status Delete Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(deleteStatusFail(error))
    toast.error("Status Delete Failed", { autoClose: 2000 });
  }
}


function* StatusSaga() {
  yield takeEvery(GET_STATUS_ALL, fetStatusData)
  yield takeEvery(SET_STATUS, onAddNewStatus)
  yield takeEvery(UPDATE_STATUS, onUpdateStatus)
  yield takeEvery(DELETE_STATUS, onDeleteStatus)
}

export default StatusSaga;