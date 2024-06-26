import React, { useState, useEffect, useContext } from "react"
import {
  Row,
  Col,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
  Modal,
  CardBody,
  Card,
  Badge,
} from "reactstrap"

import Switch from "react-switch"
import Select from "react-select"

import * as Yup from "yup"
import { useFormik } from "formik"
import DataContext from "data/DataContext"
import { t } from "i18next"
import moment from "moment"

const Offsymbol = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        fontSize: 12,
        color: "#fff",
        paddingRight: 2,
      }}
    >
      {" "}
      No
    </div>
  )
}

const OnSymbol = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        fontSize: 12,
        color: "#fff",
        paddingRight: 2,
      }}
    >
      {" "}
      Yes
    </div>
  )
}

const CustomOption = ({ innerProps, isFocused, isSelected, data }) => (
  <div
    {...innerProps}
    style={{
      backgroundColor: isFocused
        ? "lightgray"
        : isSelected
        ? "lightgray"
        : null,
      fontWeight: isSelected ? "bold" : "normal",
      height: "30px",
      padding: "4px",
    }}
  >
    {data.label}
  </div>
)

const optionConditionDate = [
  { label: "Before", value: "before" },
  { label: "After", value: "after" },
]

const optionColor = [
  {
    label: <Badge className="font-size-12 badge-soft-success">success</Badge>,
    value: "success",
  },
  {
    label: <Badge className="font-size-12 badge-soft-danger">danger</Badge>,
    value: "danger",
  },
  {
    label: <Badge className="font-size-12 badge-soft-warning">warning</Badge>,
    value: "warning",
  },
]

const optionConditionMilestone = [
  { label: "Entry date", value: "entry date" },
  {
    label: "Residence status expiration date",
    value: "residence status expiration date",
  },
  { label: "Birthday", value: "birthday" },
  { label: "Visa expiration date", value: "visa expiration date" },
  { label: "Passed orders", value: "passed orders" },
]

//redux
import { useSelector, useDispatch, shallowEqual } from "react-redux"
import { updateStatus, setStatus, getStatusAll } from "store/actions"

const ModalDatas = ({ item, modal_xlarge, setmodal_xlarge, tog_xlarge }) => {
  const user = JSON.parse(localStorage.getItem("authUser"))[0]

  const dispatch = useDispatch()

  let { dataUpdateReponse, datas, loadingUpload } = useSelector(
    state => ({
      dataUpdateReponse: state.Status.dataUpdateReponse,
      datas: state.Status.datas,
      loadingUpload: state.Status.loading,
    }),
    shallowEqual
  )

  const { isEditStatus, setIsEditStatus } = useContext(DataContext)

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: item != null ? item.id : null,
      key_license_id: item != null ? item.key_license_id : user.key_license_id,
      name: item !== null ? item.name : "",
      status_type: item !== null ? item.status_type : "manual",
      colors: item !== null ? item.colors : null,
      condition_date: item !== null ? item.condition_date : null,
      condition_milestone: item !== null ? item.condition_milestone : null,
      condition_value: item !== null ? item.condition_value : null,
      description: item !== null ? item.description : null,
      create_at: item !== null ? item.create_at : null,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required(t("This field is required")),
      status_type: Yup.string().required(t("This field is required")),
      colors: Yup.string().required(t("This field is required")),
    }),
    onSubmit: async value => {
      if (isEditStatus) {
        let obj = {
          id: value.id,
          key_license_id: value.key_license_id,
          colors: value.colors,
          status_type: value.status_type, // Có thể chỉ nhận giá trị 'manual' hoặc 'automatic'
          name: value.name,
          condition_date: value.condition_date,
          condition_milestone: value.condition_milestone,
          condition_value: value.condition_value,
          description: value.description,
          create_at: value.create_at,
          create_by: user.id,
          update_at: null,
          update_by: user.id,
          delete_at: null,
          flag: 1,
        }
        dispatch(updateStatus(obj))
        dispatch(getStatusAll())
      } else {
        let obj = {
          key_license_id: value.key_license_id,
          colors: value.colors,
          status_type: value.status_type, // Có thể chỉ nhận giá trị 'manual' hoặc 'automatic'
          name: value.name,
          condition_date: value.condition_date,
          condition_milestone: value.condition_milestone,
          condition_value: value.condition_value,
          description: value.description,
          create_at: value.create_at,
          create_by: user.id,
          update_at: null,
          update_by: user.id,
          delete_at: null,
          flag: 1,
        }
        dispatch(setStatus(obj))
        dispatch(getStatusAll())
      }
      formik.resetForm()
      setIsEditStatus(false)
      tog_xlarge()
    },
  })

  // useEffect(() => {
  //   const ngayHienTai = moment("2024-01-09")

  //   // Trừ đi 10 ngày từ ngày hiện tại
  //   const ngayTruoc10Ngay = ngayHienTai.subtract(10, "days")

  //   // Định dạng lại ngày mới
  //   const ngayFormatted = ngayTruoc10Ngay.format("DD/MM/YYYY")

  //   // In ra kết quả
  //   console.log("Ngày trước 10 ngày từ ngày 23/01/2024 là: " + ngayFormatted)
  // }, [])

  const handleSubmit = () => {
    console.log("submit")
    formik.handleSubmit()
  }

  const [isAuto, setIsAuto] = useState(false)

  useEffect(() => {
    if (isEditStatus) {
      const sw = item.status_type
      const s = sw == "manual" ? false : true
      // console.log('s', s);
      setIsAuto(s)
    }
  }, [isEditStatus])

  useEffect(() => {
    if (isAuto) {
      formik.setFieldValue("status_type", "automatic")
    } else {
      formik.setFieldValue("status_type", "manual")
    }
  }, [isAuto])

  // console.log(isEditStatus)
  // console.log("formik", formik.values)
  // console.log('datas', datas)
  // console.log('loading', loadingCareer)
  // console.log("isAuto", isAuto)

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Modal
          className="needs-validation"
          size="xl"
          isOpen={modal_xlarge}
          toggle={() => {
            tog_xlarge()
          }}
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0" id="myExtraLargeModalLabel">
              {isEditStatus ? "Edit Status" : "Add new Status"}
            </h5>
            <button
              onClick={() => {
                setIsEditStatus(false)
                formik.resetForm()
                setIsAuto(false)
                setmodal_xlarge(false)
              }}
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div className="modal-body">
            <Card>
              <CardBody>
                <div className="mb-3">
                  <Label className="form-label">{t("Status Name")}</Label>
                  <Input
                    name="name"
                    placeholder={t("Enter Status Name")}
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name || ""}
                    invalid={
                      formik.touched.name && formik.errors.name ? true : false
                    }
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <FormFeedback type="invalid">
                      {formik.errors.name}
                    </FormFeedback>
                  ) : null}
                </div>
                <div className="mb-3">
                  <Label>{t("Color")}</Label>
                  <Select
                    name="colors"
                    placeholder={t("Color")}
                    value={optionColor.find(
                      item => item.value === formik.values.colors
                    )}
                    onChange={item => {
                      console.log(item.value)
                      formik.setFieldValue("colors", item.value)
                    }}
                    options={optionColor}
                    components={{ Option: CustomOption }}
                    className="select2-selection"
                  />
                  {formik.touched.condition_date &&
                  formik.errors.condition_date ? (
                    <FormFeedback type="invalid">
                      {formik.errors.condition_date}
                    </FormFeedback>
                  ) : null}
                </div>
                <div className="mb-3">
                  <Label>{t("Description")}</Label>
                  <Input
                    name="description"
                    type="text"
                    autoComplete="off"
                    placeholder={t("Enter Description")}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.description || ""}
                    invalid={
                      formik.touched.description && formik.errors.description
                        ? true
                        : false
                    }
                  />
                  {formik.touched.description && formik.errors.description ? (
                    <FormFeedback type="invalid">
                      {formik.errors.description}
                    </FormFeedback>
                  ) : null}
                </div>

                <div className="mb-3">
                  <Switch
                    name="status_type"
                    uncheckedIcon={<Offsymbol />}
                    checkedIcon={<OnSymbol />}
                    className="me-3 mb-sm-8"
                    onColor="#626ed4"
                    onChange={value => {
                      setIsAuto(value)
                    }}
                    checked={isAuto}
                  />
                  <Label>
                    {isAuto ? "Trạng thái tự động" : "Trạng thái thủ công"}
                  </Label>
                </div>

                {isAuto && (
                  <Row>
                    <Col lg={4}>
                      <div className="mb-3">
                        <Label>Điều kiện</Label>
                        <Select
                          name="condition_date"
                          placeholder="Chọn điều kiện"
                          value={optionConditionDate.find(
                            item => item.value === formik.values.condition_date
                          )}
                          onChange={item => {
                            formik.setFieldValue("condition_date", item.value)
                          }}
                          options={optionConditionDate}
                          className="select2-selection"
                        />
                        {formik.touched.condition_date &&
                        formik.errors.condition_date ? (
                          <FormFeedback type="invalid">
                            {formik.errors.condition_date}
                          </FormFeedback>
                        ) : null}
                      </div>
                    </Col>
                    <Col lg={4}>
                      <div className="mb-3">
                        <Label>Mốc thời gian</Label>
                        <Select
                          name="condition_milestone"
                          placeholder="Chọn mốc thời gian"
                          value={optionConditionMilestone.find(
                            item =>
                              item.value === formik.values.condition_milestone
                          )}
                          onChange={item => {
                            formik.setFieldValue(
                              "condition_milestone",
                              item.value
                            )
                          }}
                          options={optionConditionMilestone}
                          className="select2-selection"
                        />
                      </div>
                    </Col>
                    <Col lg={4}>
                      <div className="mb-3">
                        <Label className="form-label">Số ngày</Label>
                        <Input
                          name="condition_value"
                          placeholder="Số ngày"
                          type="number"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.condition_value || ""}
                          invalid={
                            formik.touched.condition_value &&
                            formik.errors.condition_value
                              ? true
                              : false
                          }
                        />
                        {formik.touched.condition_value &&
                        formik.errors.condition_value ? (
                          <FormFeedback type="invalid">
                            {formik.errors.condition_value}
                          </FormFeedback>
                        ) : null}
                      </div>
                    </Col>
                  </Row>
                )}
              </CardBody>
            </Card>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={() => {
                setIsEditStatus(false)
                formik.resetForm()
                setIsAuto(false)
                tog_xlarge()
              }}
              className="btn btn-secondary "
              data-dismiss="modal"
            >
              Close
            </button>
            <Button color="primary" onClick={handleSubmit}>
              Save changes
            </Button>
          </div>
        </Modal>
      </form>
    </>
  )
}

export default ModalDatas
