import React, { useState, useEffect, useContext, useRef } from "react"
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  CardTitle,
  Label,
  Input,
  FormFeedback,
  UncontrolledTooltip,
  Modal,
  CloseButton,
  Form,
  Spinner,
} from "reactstrap"

import Select from "react-select"

import * as Yup from "yup"
import { useFormik } from "formik"
import moment from "moment"

import { useTranslation } from "react-i18next"
import { withTranslation } from "react-i18next"
import PropTypes from "prop-types"

// import context
import DataContext from "../../data/DataContext"
import avata from "../../assets/images/avata/avatar-null.png"

// import modal address
import AddressDatas from "../../components/CommonForBoth/Address/AddressDatas"

// //redux
import { useSelector, useDispatch, shallowEqual } from "react-redux"
import {
  getProvinceByNationId,
  getDistrictByProvinceId,
  getCommuneByDistrictId,
  setAddress,
  uploadImageRequest,
  getStatusAll,
  getCareerAll,
  getStatusOfResidenceAll,
  setAlienRegistrationCard,
  setStatusDetail,
  getAlienRegistrationCardAll,
  updateAlienRegistrationCard,
  updateStatusDetail,
  deleteStatusDetail,
  getDispatchingCompanyUserId,
  getReceivingFactoryUserId,
  getSyndicationUserId,
} from "store/actions"

const optionGroup = [
  { label: "Viet Nam", value: 1 },
  { label: "Japan", value: 2 },
]
const optionGender = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
]

//---------------------------------------------------------------------------------------------------------------------------------------------------//

const ModalDatas = ({
  item,
  setApi,
  updateApi,
  addressData,
  alienCardData,
  statusDetailData,
  user
}) => {
  // const user = JSON.parse(localStorage.getItem("authUser"))[0]

  const { t } = useTranslation()
  const dispatch = useDispatch()

  // theo doi lua chon status
  const [selectedMultiStatus, setselectedMultiStatus] = useState([])
  function handleMulti(selectedMultiStatus) {
    setselectedMultiStatus(selectedMultiStatus)
  }

  // Tao doi tuong luu bang the ngoai kieu
  const [alienCard, setAlienCard] = useState({
    key_license_id: user != null ? user.key_license_id : '',
    intern_id: null,
    card_number: null,
    status_of_residence_id: null,
    license_date: null,
    expiration_date: null,
    description: null,
    create_at: null,
    create_by: 1,
    update_at: null,
    update_by: 1,
    delete_at: null,
    flag: 1,
  })

  // Tao doi luong luu bang chi tiet trang thai
  const statusDetailObj = {
    key_license_id: user != null ? user.key_license_id : '',
    intern_id: null,
    status_id: null,
    description: null,
    create_at: null,
    create_by: 1,
    update_at: null,
    update_by: 1,
    delete_at: null,
    flag: 1,
  }

  // data context
  const {
    modal_fullscreen,
    setmodal_fullscreen,
    tog_fullscreen,
    isEditIntern,
    setIsEditIntern,
    addressIntern,
    addressDataIntern,
    updateAddressDataIntern,
    isRefresh,
    updateRefresh,
    // user,
  } = useContext(DataContext)

  // Radio button
  const [selectAddressDefault, setSelectAddressDefault] = useState(0)
  const handleChangeDefault = event => {
    setSelectAddressDefault(event.target.value)
  }

  // kiem tra trang thai xem co duoc ghi dia chi
  const [isCreateAddress, setIsCreateAddress] = useState(false)

  // Du lieu trong redux
  const {
    provinceDataByNationId,
    districtDataByProvinceId,
    communeDataByDistrictId,
    internCreate,
    companyData,
    factoryData,
    syndicationData,
    statusData,
    careerData,
    statusOfResidenceData,
    loadingIntern,
    alienCardDatas,
  } = useSelector(
    state => ({
      provinceDataByNationId: state.Province.dataByNationId,
      districtDataByProvinceId: state.District.dataByProvinceId,
      communeDataByDistrictId: state.Commune.dataByDistrictId,
      internCreate: state.Intern.data,
      loadingIntern: state.Intern.loading,
      companyData: state.DispatchingCompany.datas,
      factoryData: state.ReceivingFactory.datas,
      syndicationData: state.Syndication.datas,
      statusData: state.Status.datas,
      careerData: state.Career.datas,
      statusOfResidenceData: state.StatusOfResidence.datas,
      alienCardDatas: state.AlienRegistrationCard.datas,
    }),
    shallowEqual
  )

  // Get du lieu lan dau
  useEffect(() => {
    if (user) {
      dispatch(getDispatchingCompanyUserId(user.id))
      dispatch(getReceivingFactoryUserId(user.id))
      dispatch(getSyndicationUserId(user.id))
      dispatch(getStatusAll())
      dispatch(getCareerAll())
      dispatch(getStatusOfResidenceAll())
      dispatch(getAlienRegistrationCardAll())
    }
  }, [dispatch])

  // xu ly form nhap anh
  const fileInputRef = useRef()
  const [selectedFile, setSelectedFile] = useState(null)
  const [showAvata, setShowAvata] = useState(avata)
  const handleChange = event => {
    const file = event.target.files[0]
    setSelectedFile(file)
    formik.setFieldValue("avata", file.name)
    if (file) {
      const reader = new FileReader()
      reader.onload = e => {
        setShowAvata(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const [numStatusDetail, setNumTicketStatus] = useState([])
  const [on, setOn] = useState(false)
  useEffect(() => {
    // console.log('chay ------------------------------------------------------------------------', on)
    if (item != null && on == false) {
      // console.log('chay ------------------------------------------------------------------------')
      const arr = statusDetailData.filter(sdd => sdd.intern_id == item.id)
      setNumTicketStatus(arr)

      const selectedStatus = arr.map((statusDetail, index) => {
        return statusData.find(sd => sd.id == statusDetail.status_id)
      })
      setselectedMultiStatus(selectedStatus)

      const card = alienCardDatas.find(item => item.intern_id == item.id)
      // console.log("card:", card)
      setAlienCard(card)

      setOn(true)
    }
  }, [item])

  // console.log(numStatusDetail)

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: item != null ? item.id : "",
      key_license_id:
        item != null
          ? item.key_license_id
          : user != null
          ? user.key_license_id
          : "",
      type: "intern",
      avata: item != null ? item.avata : "",
      avata_update_at:
        item != null
          ? moment(item.date_of_joining_syndication)
              .utcOffset("+09:00")
              .format("YYYY-MM-DD")
          : null,
      first_name_jp: item != null ? item.first_name_jp : "",
      middle_name_jp: item != null ? item.middle_name_jp : "",
      last_name_jp: item != null ? item.last_name_jp : "",
      first_name_en: item != null ? item.first_name_en : "",
      middle_name_en: item != null ? item.middle_name_en : "",
      last_name_en: item != null ? item.last_name_en : "",
      gender: item != null ? item.gender : "male",
      dob:
        item != null
          ? moment(item.date_of_joining_syndication)
              .utcOffset("+09:00")
              .format("YYYY-MM-DD")
          : null,
      career_id: item != null ? item.career_id : "",
      passport_code: item != null ? item.passport_code : "",
      passport_license_date:
        item != null
          ? moment(item.date_of_joining_syndication)
              .utcOffset("+09:00")
              .format("YYYY-MM-DD")
          : null,
      passport_expiration_date:
        item != null
          ? moment(item.date_of_joining_syndication)
              .utcOffset("+09:00")
              .format("YYYY-MM-DD")
          : null,
      entry_date:
        item != null
          ? moment(item.entry_date)
              .utcOffset("+09:00")
              .format("YYYY-MM-DD")
          : null,
      alert: item != null ? item.alert : 0,
      phone_domestically: item != null ? item.phone_domestically : "",
      phone_abroad: item != null ? item.phone_abroad : "",


      syndication_id: item != null ? item.syndication_id : (user.object_type == 'syndication' ? user.object_id : ''),
      receiving_factory_id: item != null ? item.receiving_factory_id : (user.object_type == 'receiving_factory' ? user.object_id : ''),


      dispatching_company_id: item != null ? item.dispatching_company_id : "",
      description: item != null ? item.description : "",
      create_at: item != null ? item.create_at : "",
      create_by: item != null ? item.create_by : 1,
      update_at: item != null ? item.update_at : "",
      update_by: item != null ? item.update_by : 1,

      nation_id: 1,
      alien_registration_card_number:
        item != null
          ? alienCardData.find(i => i.intern_id == item.id) != null
            ? alienCardData.find(i => i.intern_id == item.id).card_number
            : ""
          : "", // số thẻ ngoại kiều
      status_of_residence_id:
        item != null
          ? statusOfResidenceData.find(i => i.name == item.sor_name) != null
            ? statusOfResidenceData.find(i => i.name == item.sor_name).id
            : ""
          : "", // Tư cách lưu trú

      license_date:
        item != null
          ? alienCardData.find(i => i.intern_id == item.id) != null
            ? moment(
                alienCardData.find(i => i.intern_id == item.id).license_date
              )
                .utcOffset("+09:00")
                .format("YYYY-MM-DD")
            : ""
          : "",
      expiration_date:
        item != null
          ? alienCardData.find(i => i.intern_id == item.id) != null
            ? moment(
                alienCardData.find(i => i.intern_id == item.id).expiration_date
              )
                .utcOffset("+09:00")
                .format("YYYY-MM-DD")
            : ""
          : "",
      status_id:
        item != null
          ? statusDetailData.filter(i => i.intern_id == item.id) != null
            ? statusDetailData.filter(i => i.intern_id == item.id)
            : ""
          : "", // trạng thái
    },
    validationSchema: Yup.object().shape({
      first_name_jp: Yup.string().required("This value is required"),
      last_name_jp: Yup.string().required("This value is required"),
      first_name_en: Yup.string().required("This value is required"),
      last_name_en: Yup.string().required("This value is required"),
      gender: Yup.string().required("This value is required"),
      dob: Yup.date().required("Please select date"),
      career_id: Yup.string().required("This value is required"),
      passport_code: Yup.string().required("This value is required"),
      passport_license_date: Yup.date().required("Please select date"),
      passport_expiration_date: Yup.date().required("Please select date"),
      receiving_factory_id: Yup.string().required("This value is required"),
      dispatching_company_id: Yup.string().required("This value is required"),
      license_date: Yup.date().required("Please select date"),
      expiration_date: Yup.date().required("Please select date"),
    }),

    onSubmit: async value => {
      if (isEditIntern) {
        let obj = {
          id: value.id,
          key_license_id: value.key_license_id,
          syndication_id: value.syndication_id,
          type: "intern",
          avata: value.avata,
          avata_update_at: value.avata_update_at,
          first_name_jp: value.first_name_jp,
          middle_name_jp: value.middle_name_jp,
          last_name_jp: value.last_name_jp,
          first_name_en: value.first_name_en,
          middle_name_en: value.middle_name_en,
          last_name_en: value.last_name_en,
          gender: value.gender,
          dob: value.dob,
          career_id: value.career_id,
          passport_code: value.passport_code,
          passport_license_date: value.passport_license_date,
          passport_expiration_date: value.passport_expiration_date,
          entry_date: value.entry_date,
          alert: value.alert,
          phone_domestically: value.phone_domestically,
          phone_abroad: value.phone_abroad,
          receiving_factory_id: value.receiving_factory_id,
          dispatching_company_id: value.dispatching_company_id,
          description: value.description,
          create_at: value.create_at,
          create_by: value.create_by,
          update_at: null,
          update_by: value.update_by,
          delete_at: null,
          flag: 1,
        }
        dispatch(updateApi(obj))

        // Xac dinh so luong numStatusDetail ban dau : a
        // xem so luong selectedMultiStatus moi cap nhat : b
        // neu a > b => 0 - b : se UPDATE , b -> a : se DELETE
        // neu a = b => thi tat ca deu la UPDATE
        // neu a < b => a : se UPDATE , b-a : se SET
        // console.log("numStatusDetail.length", numStatusDetail.length)
        // console.log("selectedMultiStatus.length", selectedMultiStatus.length)

        if (numStatusDetail.length > 0) {
          if (numStatusDetail.length > selectedMultiStatus.length) {
            for (let i = 0; i < numStatusDetail.length; i++) {
              let ticketStatusId = numStatusDetail[i].id
              if (i < selectedMultiStatus.length) {
                const newStatusDetail = {
                  ...numStatusDetail[i],
                  status_id: selectedMultiStatus[i].id,
                }
                const { name, colors, ...ns } = newStatusDetail
                dispatch(updateStatusDetail(ns))
              } else {
                dispatch(deleteStatusDetail(ticketStatusId))
              }
            }
          } else if (numStatusDetail.length == selectedMultiStatus.length) {
            for (let i = 0; i < numStatusDetail.length; i++) {
              const newStatusDetail = {
                ...numStatusDetail[i],
                status_id: selectedMultiStatus[i].id,
              }
              const { name, colors, ...ns } = newStatusDetail
              dispatch(updateStatusDetail(ns))
            }
          } else {
            for (let i = 0; i < selectedMultiStatus.length; i++) {
              if (i < numStatusDetail.length) {
                const newStatusDetail = {
                  ...numStatusDetail[i],
                  status_id: selectedMultiStatus[i].id,
                }
                const { name, colors, ...ns } = newStatusDetail
                // console.log('ns', ns)
                dispatch(updateStatusDetail(ns))
              } else {
                const newStatusDetail = {
                  ...statusDetailObj,
                  intern_id: value.id,
                  status_id: selectedMultiStatus[i].id,
                }
                dispatch(setStatusDetail(newStatusDetail))
              }
            }
          }
        } else {
          for (let i = 0; i < selectedMultiStatus.length; i++) {
            const newStatusDetail = {
              ...statusDetailObj,
              intern_id: value.id,
              status_id: selectedMultiStatus[i].id,
            }
            dispatch(setStatusDetail(newStatusDetail))
          }
        }

        const newCrad = {
          ...alienCard,
          card_number: value.alien_registration_card_number,
          status_of_residence_id: value.status_of_residence_id,
          license_date: value.license_date,
          expiration_date: value.expiration_date,
        }
        dispatch(updateAlienRegistrationCard(newCrad))

        setselectedMultiStatus([])
        setOn(false)
        tog_fullscreen()
        formik.resetForm()
        item = null
        setSelectedFile(null)
      } else {
        let obj = {
          key_license_id: value.key_license_id,
          syndication_id: value.syndication_id,
          type: "intern",
          avata: value.avata,
          avata_update_at: value.avata_update_at,
          first_name_jp: value.first_name_jp,
          middle_name_jp: value.middle_name_jp,
          last_name_jp: value.last_name_jp,
          first_name_en: value.first_name_en,
          middle_name_en: value.middle_name_en,
          last_name_en: value.last_name_en,
          gender: value.gender,
          dob: value.dob,
          career_id: value.career_id,
          passport_code: value.passport_code,
          passport_license_date: value.passport_license_date,
          passport_expiration_date: value.passport_expiration_date,
          entry_date: value.entry_date,
          alert: value.alert,
          phone_domestically: value.phone_domestically,
          phone_abroad: value.phone_abroad,
          receiving_factory_id: value.receiving_factory_id,
          dispatching_company_id: value.dispatching_company_id,
          description: value.description,
          create_at: null,
          create_by: value.create_by,
          update_at: null,
          update_by: value.update_by,
          delete_at: null,
          flag: 1,
        }
        dispatch(setApi(obj))

        const card = {
          ...alienCard,
          card_number: value.alien_registration_card_number,
          status_of_residence_id: value.status_of_residence_id,
          license_date: value.license_date,
          expiration_date: value.expiration_date,
        }
        // bo id trong card de insert
        const { id, ...newCard } = card
        setAlienCard(newCard)
        setIsCreateAddress(true)
      }

      // upload anh len server
      if (selectedFile) {
        const formData = new FormData()
        formData.append("image", selectedFile)
        dispatch(uploadImageRequest(formData))
        // dispatch(uploadFile(formData));
      }

      console.log("submit done")
    },
  })

  // thuc thi formik
  const handleSubmit = () => {
    console.log("submit")
    formik.handleSubmit()
    // console.log(multiStatus)
  }
  //---------------------------------------------------------------------------------------

  // nap du lieu cho dia chi neu la chinh sua
  useEffect(() => {
    // console.log('check');
    if (isEditIntern) {
      if (item !== null) {
        const arr = addressData.filter(
          address =>
            address.object_id == item.id && address.user_type == "intern"
        )
        // console.log('arr', arr)
        updateAddressDataIntern(arr)
      }
    }
  }, [isEditIntern])

  //---------------------------------------------------------------------------------------------------------------
  // GHi du lieu dia chi vao database
  useEffect(() => {
    if (internCreate) {
      if (isCreateAddress && !loadingIntern) {
        const id = internCreate["id"]
        // console.log('id:', id);
        const newCard = { ...alienCard, intern_id: id }
        dispatch(setAlienRegistrationCard(newCard))

        const multiStatus = selectedMultiStatus.map(status => {
          return { ...statusDetailObj, status_id: status.id, intern_id: id }
        })
        multiStatus.forEach(st => {
          dispatch(setStatusDetail(st))
        })

        addressDataIntern.forEach((address, index) => {
          const newAddress = {
            ...address,
            key_license_id: user.key_license_id,
            object_id: id,
            is_default: selectAddressDefault == index ? 1 : 0,
          }
          dispatch(setAddress(newAddress))
        })

        setIsCreateAddress(false)
        setselectedMultiStatus([])
        setOn(false)
        tog_fullscreen()
        formik.resetForm()
        item = null
        setSelectedFile(null)
      }
    }
  }, [internCreate, isCreateAddress])
  //----------------------------------------------------------------------------------------------------------------

  // xu ly khi them form nhap dia chi
  const handleAddForm = () => {
    updateAddressDataIntern([...addressDataIntern, addressIntern])
  }

  // xu ly khi xoa form nhap dia chi
  const handleDeleteColumn = getIndex => {
    const arr = [...addressDataIntern]
    arr.splice(getIndex, 1)
    updateAddressDataIntern(arr)
  }

  //---------------------------------------------------------------------------------------

  // dem so ky tu o nhap note
  const [textareabadge, settextareabadge] = useState(0)
  const [textcount, settextcount] = useState(0)
  function textareachange(event) {
    const count = event.target.value.length
    if (count > 0) {
      settextareabadge(true)
    } else {
      settextareabadge(false)
    }
    settextcount(event.target.value.length)
  }

  //---------------------------------------------------------------------------------------

  // render lua chon tinh, huyen, xa

  const [selectNation, setSelectNation] = useState(null)
  const [selectProvince, setSelectProvince] = useState(null)
  const [selectDistrict, setSelectDistrict] = useState(null)
  const [selectCommune, setSelectCommune] = useState(null)

  const [provinceOptions, setProvinceOptions] = useState([])
  const [districtOptions, setDistrictOptions] = useState([])
  const [communeOptions, setCommuneOptions] = useState([])

  // Tai du lieu thanh pho
  useEffect(() => {
    if (selectNation) {
      dispatch(getProvinceByNationId(selectNation.value))
      // setSelectProvince([]);
    }
  }, [selectNation])

  //---------------------------------------------------------------------------------------

  // tao danh sach lua chon tinh/thanh pho
  useEffect(() => {
    if (provinceDataByNationId) {
      const data = provinceDataByNationId.map(province => {
        return {
          ...province,
          label: province.StateName_ja,
          value: province.StateName_ja,
        }
      })
      setProvinceOptions(data)
    }
  }, [provinceDataByNationId])

  //---------------------------------------------------------------------------------------

  // Xu ly danh sach district
  useEffect(() => {
    if (selectProvince !== null) {
      dispatch(getDistrictByProvinceId(selectProvince.StateID))
      setSelectDistrict("")
    }
  }, [selectProvince])

  useEffect(() => {
    if (districtDataByProvinceId !== null) {
      const data = districtDataByProvinceId.map(district => {
        return {
          ...district,
          label: district.DistrictName_ja,
          value: district.DistrictName_ja,
        }
      })
      setDistrictOptions(data)
    }
  }, [districtDataByProvinceId])

  //---------------------------------------------------------------------------------------
  // xu ly tai danh sach commune
  useEffect(() => {
    if (selectDistrict !== null) {
      dispatch(getCommuneByDistrictId(selectDistrict.DistrictID))
      setSelectCommune("")
    }
  }, [selectDistrict])

  useEffect(() => {
    if (communeDataByDistrictId !== null) {
      const data = communeDataByDistrictId.map(commune => {
        return {
          ...commune,
          label: commune.WardName_ja,
          value: commune.WardName_ja,
        }
      })
      setCommuneOptions(data)
    }
  }, [communeDataByDistrictId])
  //---------------------------------------------------------------------------------------

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async function tog_resresh() {
    console.log("11111")
    updateRefresh(!isRefresh)
    await delay(2000)
    console.log("22222")
    updateRefresh(isRefresh)
  }

  // if (isRefresh === false) {
  //   updateRefresh(true)
  // }

  console.log("formik:", formik.values)
  // console.log('alienCardData:', alienCardData)
  // console.log('user:', user.object_type)
  // console.log('isEditIntern:', isEditIntern)
  // console.log('loadingIntern:', loadingIntern)
  // console.log("selectedMultiStatus:", selectedMultiStatus)
  // console.log("selectedFile:", selectedFile)
  // console.log("isRefresh:", isRefresh)
  // console.log("item:", item)

  return (
    <>
      <Form>
        <Modal
          size="xl"
          isOpen={modal_fullscreen}
          toggle={() => {
            tog_fullscreen()
          }}
          className="modal-fullscreen"
        >
          <div className="modal-header bg-primary">
            <h5 className="modal-title mt-0" id="exampleModalFullscreenLabel">
              {isEditIntern ? t("Edit") : t("Add Intern")}
            </h5>
            <button
              onClick={() => {
                setmodal_fullscreen(false)
                setIsEditIntern(false)
                setselectedMultiStatus([])
                setOn(false)
                setSelectedFile(null)
              }}
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div className="modal-body" style={{ paddingBottom: "200px" }}>
            <Row>
              <Col lg={12}>
                <Card>
                  {/* <CardBody> */}

                  <Card>
                    <CardBody className="bg-light">
                      <Row>
                        <Col lg={2} xl={1} sm={3}>
                          <Card
                          // style={{ width: '90%' }}
                          >
                            <CardBody className="d-flex flex-column">
                              <div style={{ aspectRatio: 1 }}>
                                <img
                                  style={{ width: "100%", height: "100%" }}
                                  className="rounded-circle img-thumbnail"
                                  alt="avata"
                                  src={showAvata}
                                />
                              </div>
                              <CardTitle tag="h5" className="text-center mt-2">
                                Admin
                              </CardTitle>
                              <Button
                                onClick={() => fileInputRef.current.click()}
                              >
                                {t("Upload Avata")}
                              </Button>{" "}
                              <input
                                onChange={handleChange}
                                multiple={false}
                                ref={fileInputRef}
                                type="file"
                                hidden
                              />
                            </CardBody>
                          </Card>
                        </Col>

                        <Col lg={5} xl={6}>
                          <Card className="h-100">
                            <CardBody>
                              <Row>
                                <Col lg={4} className="gx-1">
                                  <div className="mb-3">
                                    <Label className="form-label fw-bold">
                                      {t("Last Name")}
                                    </Label>
                                    <Input
                                      name="first_name_jp"
                                      placeholder={t("Last Name")}
                                      type="text"
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      value={formik.values.first_name_jp || ""}
                                      invalid={
                                        formik.touched.first_name_jp &&
                                        formik.errors.first_name_jp
                                          ? true
                                          : false
                                      }
                                    />
                                    {formik.touched.first_name_jp &&
                                    formik.errors.first_name_jp ? (
                                      <FormFeedback type="invalid">
                                        {formik.errors.first_name_jp}
                                      </FormFeedback>
                                    ) : null}
                                  </div>

                                  <div className="mb-3">
                                    <Input
                                      name="first_name_en"
                                      type="text"
                                      autoComplete="off"
                                      placeholder={t("Last Name (English)")}
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      value={formik.values.first_name_en || ""}
                                      invalid={
                                        formik.touched.first_name_en &&
                                        formik.errors.first_name_en
                                          ? true
                                          : false
                                      }
                                    />
                                    {formik.touched.first_name_en &&
                                    formik.errors.first_name_en ? (
                                      <FormFeedback type="invalid">
                                        {formik.errors.first_name_en}
                                      </FormFeedback>
                                    ) : null}
                                  </div>
                                </Col>
                                <Col lg={4} className="gx-1">
                                  <div className="mb-3">
                                    <Label className="form-label fw-bold">
                                      {t("Middle Name")}
                                    </Label>
                                    <Input
                                      name="middle_name_jp"
                                      type="text"
                                      autoComplete="off"
                                      placeholder={t("Middle Name")}
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      value={formik.values.middle_name_jp || ""}
                                      invalid={
                                        formik.touched.middle_name_jp &&
                                        formik.errors.middle_name_jp
                                          ? true
                                          : false
                                      }
                                    />
                                    {formik.touched.middle_name_jp &&
                                    formik.errors.middle_name_jp ? (
                                      <FormFeedback type="invalid">
                                        {formik.errors.middle_name_jp}
                                      </FormFeedback>
                                    ) : null}
                                  </div>

                                  <div className="mb-3">
                                    <Input
                                      name="middle_name_en"
                                      placeholder={t("Middle Name (English)")}
                                      type="text"
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      value={formik.values.middle_name_en || ""}
                                      invalid={
                                        formik.touched.middle_name_en &&
                                        formik.errors.middle_name_en
                                          ? true
                                          : false
                                      }
                                    />
                                    {formik.touched.middle_name_en &&
                                    formik.errors.middle_name_en ? (
                                      <FormFeedback type="invalid">
                                        {formik.errors.middle_name_en}
                                      </FormFeedback>
                                    ) : null}
                                  </div>
                                </Col>
                                <Col lg={4} className="gx-1">
                                  <div className="mb-3">
                                    <Label className="form-label fw-bold">
                                      {t("First Name")}
                                    </Label>
                                    <Input
                                      name="last_name_jp"
                                      type="text"
                                      autoComplete="off"
                                      placeholder={t("First Name")}
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      value={formik.values.last_name_jp || ""}
                                      invalid={
                                        formik.touched.last_name_jp &&
                                        formik.errors.last_name_jp
                                          ? true
                                          : false
                                      }
                                    />
                                    {formik.touched.last_name_jp &&
                                    formik.errors.last_name_jp ? (
                                      <FormFeedback type="invalid">
                                        {formik.errors.last_name_jp}
                                      </FormFeedback>
                                    ) : null}
                                  </div>

                                  <div className="mb-3">
                                    <Input
                                      name="last_name_en"
                                      placeholder={t("First Name (English)")}
                                      type="text"
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      value={formik.values.last_name_en || ""}
                                      invalid={
                                        formik.touched.last_name_en &&
                                        formik.errors.last_name_en
                                          ? true
                                          : false
                                      }
                                    />
                                    {formik.touched.last_name_en &&
                                    formik.errors.last_name_en ? (
                                      <FormFeedback type="invalid">
                                        {formik.errors.last_name_en}
                                      </FormFeedback>
                                    ) : null}
                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                <Col lg={4} className="gx-1">
                                  <div className="mb-3">
                                    <Label className="form-label fw-bold">
                                      {t("Country")}
                                    </Label>
                                    <Select
                                      name="nation_id"
                                      placeholder={t("Country")}
                                      value={optionGroup.find(
                                        option =>
                                          option.value ===
                                          formik.values.nation_id
                                      )}
                                      onChange={item => {
                                        formik.setFieldValue(
                                          "nation_id",
                                          item.value
                                        )
                                      }}
                                      options={optionGroup}
                                      // components={{ Option: CustomOption }}
                                      // isClearable
                                    />
                                  </div>
                                </Col>
                                <Col lg={4} className="gx-1">
                                  <div className="mb-3">
                                    <Label className="form-label fw-bold">
                                      {t("Gender")}
                                    </Label>
                                    <Select
                                      name="gender"
                                      placeholder={t("Gender")}
                                      value={optionGender.find(
                                        option =>
                                          option.value === formik.values.gender
                                      )}
                                      onChange={item => {
                                        formik.setFieldValue(
                                          "gender",
                                          item == null ? null : item.value
                                        )
                                      }}
                                      options={optionGender}
                                      // isClearable
                                    />
                                  </div>
                                </Col>
                                <Col lg={4} className="gx-1">
                                  <div className="mb-3">
                                    <Label className="form-label fw-bold">
                                      {t("Date of Birth")}
                                    </Label>
                                    <Input
                                      name="dob"
                                      placeholder={t("Date of Birth")}
                                      type="date"
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      value={formik.values.dob || ""}
                                      invalid={
                                        formik.touched.dob && formik.errors.dob
                                          ? true
                                          : false
                                      }
                                    />
                                    {formik.touched.dob && formik.errors.dob ? (
                                      <FormFeedback type="invalid">
                                        {formik.errors.dob}
                                      </FormFeedback>
                                    ) : null}
                                  </div>
                                </Col>
                              </Row>

                              <Row>
                                <Col lg={6} className="gx-1">
                                  <div className="mb-3">
                                    <Label className="form-label fw-bold">
                                      {t("Domestic Phone Number")}
                                    </Label>
                                    <Input
                                      name="phone_domestically"
                                      placeholder={t("Domestic Phone Number")}
                                      type="text"
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      value={
                                        formik.values.phone_domestically || ""
                                      }
                                      invalid={
                                        formik.touched.phone_domestically &&
                                        formik.errors.phone_domestically
                                          ? true
                                          : false
                                      }
                                    />
                                    {formik.touched.phone_domestically &&
                                    formik.errors.phone_domestically ? (
                                      <FormFeedback type="invalid">
                                        {formik.errors.phone_domestically}
                                      </FormFeedback>
                                    ) : null}
                                  </div>
                                </Col>
                                <Col lg={6} className="gx-1">
                                  <div className="mb-3">
                                    <Label className="form-label fw-bold">
                                      {t("Phone Number")}
                                    </Label>
                                    <Input
                                      name="phone_abroad"
                                      placeholder={t("Phone Number")}
                                      type="text"
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      value={formik.values.phone_abroad || ""}
                                      invalid={
                                        formik.touched.phone_abroad &&
                                        formik.errors.phone_abroad
                                          ? true
                                          : false
                                      }
                                    />
                                    {formik.touched.phone_abroad &&
                                    formik.errors.phone_abroad ? (
                                      <FormFeedback type="invalid">
                                        {formik.errors.phone_abroad}
                                      </FormFeedback>
                                    ) : null}
                                  </div>
                                </Col>
                              </Row>

                              <Row>
                                <Col lg={12} className="gx-1">
                                  <div className="mb-3">
                                    <Label className="form-label fw-bold">
                                      {t("Passport Number")}
                                    </Label>
                                    <Input
                                      name="passport_code"
                                      placeholder={t("Passport Number")}
                                      type="text"
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      value={formik.values.passport_code || ""}
                                      invalid={
                                        formik.touched.passport_code &&
                                        formik.errors.passport_code
                                          ? true
                                          : false
                                      }
                                    />
                                    {formik.touched.passport_code &&
                                    formik.errors.passport_code ? (
                                      <FormFeedback type="invalid">
                                        {formik.errors.passport_code}
                                      </FormFeedback>
                                    ) : null}
                                  </div>
                                </Col>
                              </Row>

                              <Row>
                                <Col lg={6} className="gx-1">
                                  <div className="mb-3">
                                    <Label className="form-label fw-bold">
                                      {t("Date of Issue")}
                                    </Label>
                                    <Input
                                      name="passport_license_date"
                                      placeholder={t("Date of Issue")}
                                      type="date"
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      value={
                                        formik.values.passport_license_date ||
                                        ""
                                      }
                                      invalid={
                                        formik.touched.passport_license_date &&
                                        formik.errors.passport_license_date
                                          ? true
                                          : false
                                      }
                                    />
                                    {formik.touched.passport_license_date &&
                                    formik.errors.passport_license_date ? (
                                      <FormFeedback type="invalid">
                                        {formik.errors.passport_license_date}
                                      </FormFeedback>
                                    ) : null}
                                  </div>
                                </Col>
                                <Col lg={6} className="gx-1">
                                  <div className="mb-3">
                                    <Label className="form-label fw-bold">
                                      {t("Expiry Date")}
                                    </Label>
                                    <Input
                                      name="passport_expiration_date"
                                      placeholder={t("Expiry Date")}
                                      type="date"
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      value={
                                        formik.values
                                          .passport_expiration_date || ""
                                      }
                                      invalid={
                                        formik.touched
                                          .passport_expiration_date &&
                                        formik.errors.passport_expiration_date
                                          ? true
                                          : false
                                      }
                                    />
                                    {formik.touched.passport_expiration_date &&
                                    formik.errors.passport_expiration_date ? (
                                      <FormFeedback type="invalid">
                                        {formik.errors.passport_expiration_date}
                                      </FormFeedback>
                                    ) : null}
                                  </div>
                                </Col>
                              </Row>
                            </CardBody>
                          </Card>
                        </Col>

                        <Col lg={5} xl={5}>
                          <Card className="h-100">
                            <CardBody>
                              <Row>
                                <Col lg={6} className="gx-1">
                                  <div className="mb-3">
                                    <Label className="form-label fw-bold">
                                      {t("Dispatching Company")}
                                    </Label>
                                    <Select
                                      name="dispatching_company_id"
                                      placeholder={t("Dispatching Company")}
                                      value={companyData.find(
                                        option =>
                                          option.value ===
                                          formik.values.dispatching_company_id
                                      )}
                                      onChange={item => {
                                        formik.setFieldValue(
                                          "dispatching_company_id",
                                          item.value
                                        )
                                      }}
                                      options={companyData}
                                      // isClearable
                                    />
                                  </div>
                                </Col>

                                {user &&
                                  user.object_type == "receiving_factory" && (
                                    <Col lg={6} className="gx-1">
                                      <div className="mb-3">
                                        <Label className="form-label fw-bold">
                                          {t("Syndication")}
                                        </Label>
                                        <Select
                                          name="syndication_id"
                                          placeholder={t("Syndication")}
                                          value={syndicationData.find(
                                            option =>
                                              option.value ===
                                              formik.values.syndication_id
                                          )}
                                          onChange={item => {
                                            formik.setFieldValue(
                                              "syndication_id",
                                              item == null ? null : item.value
                                            )
                                          }}
                                          options={syndicationData}
                                          // isClearable
                                        />
                                      </div>
                                    </Col>
                                  )}

                                {user && user.object_type == "syndication" && (
                                  <Col lg={6} className="gx-1">
                                    <div className="mb-3">
                                      <Label className="form-label fw-bold">
                                        {t("Receiving Factory")}
                                      </Label>
                                      <Select
                                        name="receiving_factory_id"
                                        placeholder={t("Receiving Factory")}
                                        value={factoryData.find(
                                          option =>
                                            option.value ===
                                            formik.values.receiving_factory_id
                                        )}
                                        onChange={item => {
                                          formik.setFieldValue(
                                            "receiving_factory_id",
                                            item == null ? null : item.value
                                          )
                                        }}
                                        options={factoryData}
                                        // isClearable
                                      />
                                    </div>
                                  </Col>
                                )}
                              </Row>
                              <Row className="">
                                <Col lg={6} className="gx-1">
                                  <div className="mb-3">
                                    <Label className="form-label fw-bold">
                                      {t("Status")}
                                    </Label>
                                    <Select
                                      placeholder={t("Status")}
                                      value={selectedMultiStatus}
                                      isMulti={true}
                                      onChange={value => {
                                        // console.log(value);
                                        handleMulti(value)
                                      }}
                                      options={statusData}
                                      className="select2-selection"
                                      isLoading={true}
                                    />
                                  </div>
                                </Col>
                                <Col lg={6} className="gx-1">
                                  <div className="mb-3">
                                    <Label className="form-label fw-bold">
                                      {t("Industry")}
                                    </Label>
                                    <Select
                                      name="career_id"
                                      placeholder={t("Industry")}
                                      value={careerData.find(
                                        option =>
                                          option.value ===
                                          formik.values.career_id
                                      )}
                                      onChange={item => {
                                        formik.setFieldValue(
                                          "career_id",
                                          item == null ? null : item.value
                                        )
                                      }}
                                      options={careerData}
                                      // isClearable
                                    />
                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                <Col lg={6} className="gx-1">
                                  <div className="mb-3">
                                    <Label className="form-label fw-bold">
                                      {t("Foreigner Registration No.")}
                                    </Label>
                                    <Input
                                      name="alien_registration_card_number"
                                      placeholder={t(
                                        "Foreigner Registration No."
                                      )}
                                      type="text"
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      value={
                                        formik.values
                                          .alien_registration_card_number || ""
                                      }
                                      invalid={
                                        formik.touched
                                          .alien_registration_card_number &&
                                        formik.errors
                                          .alien_registration_card_number
                                          ? true
                                          : false
                                      }
                                    />
                                    {formik.touched
                                      .alien_registration_card_number &&
                                    formik.errors
                                      .alien_registration_card_number ? (
                                      <FormFeedback type="invalid">
                                        {
                                          formik.errors
                                            .alien_registration_card_number
                                        }
                                      </FormFeedback>
                                    ) : null}
                                  </div>
                                </Col>
                                <Col lg={6} className="gx-1">
                                  <div className="mb-3">
                                    <Label className="form-label fw-bold">
                                      {t("Residence Status")}
                                    </Label>
                                    <Select
                                      name="status_of_residence_id"
                                      placeholder={t("Residence Status")}
                                      value={statusOfResidenceData.find(
                                        option =>
                                          option.value ===
                                          formik.values.status_of_residence_id
                                      )}
                                      onChange={item => {
                                        formik.setFieldValue(
                                          "status_of_residence_id",
                                          item == null ? null : item.value
                                        )
                                      }}
                                      options={statusOfResidenceData}
                                      // isClearable
                                    />
                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                <Col lg={4} className="gx-1">
                                  <div className="mb-3">
                                    <Label className="form-label fw-bold">
                                      {t("Date of Issue")}
                                    </Label>
                                    <Input
                                      name="license_date"
                                      placeholder={t("Date of Issue")}
                                      type="date"
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      value={formik.values.license_date || ""}
                                      invalid={
                                        formik.touched.license_date &&
                                        formik.errors.license_date
                                          ? true
                                          : false
                                      }
                                    />
                                    {formik.touched.license_date &&
                                    formik.errors.license_date ? (
                                      <FormFeedback type="invalid">
                                        {formik.errors.license_date}
                                      </FormFeedback>
                                    ) : null}
                                  </div>
                                </Col>
                                <Col lg={4} className="gx-1">
                                  <div className="mb-3">
                                    <Label className="form-label fw-bold">
                                      {t("Expiry Date")}
                                    </Label>
                                    <Input
                                      name="expiration_date"
                                      type="date"
                                      autoComplete="off"
                                      placeholder={t("Expiry Date")}
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      value={
                                        formik.values.expiration_date || ""
                                      }
                                      invalid={
                                        formik.touched.expiration_date &&
                                        formik.errors.expiration_date
                                          ? true
                                          : false
                                      }
                                    />
                                    {formik.touched.expiration_date &&
                                    formik.errors.expiration_date ? (
                                      <FormFeedback type="invalid">
                                        {formik.errors.expiration_date}
                                      </FormFeedback>
                                    ) : null}
                                  </div>
                                </Col>
                                <Col lg={4} className="gx-1">
                                  <div className="mb-3">
                                    <Label className="form-label fw-bold">
                                      {t("Entry date")}
                                    </Label>
                                    <Input
                                      name="entry_date"
                                      type="date"
                                      autoComplete="off"
                                      placeholder={t("Entry date")}
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      value={formik.values.entry_date || ""}
                                      invalid={
                                        formik.touched.entry_date &&
                                        formik.errors.entry_date
                                          ? true
                                          : false
                                      }
                                    />
                                    {formik.touched.entry_date &&
                                    formik.errors.entry_date ? (
                                      <FormFeedback type="invalid">
                                        {formik.errors.entry_date}
                                      </FormFeedback>
                                    ) : null}
                                  </div>
                                </Col>
                              </Row>

                              <Row>
                                <Col lg={12} className="gx-1">
                                  <div className="mt-2">
                                    <Label className="form-label fw-bold">
                                      {t("Note")}
                                    </Label>
                                    <Input
                                      name="description"
                                      type="textarea"
                                      id="textarea"
                                      onChange={e => {
                                        textareachange(e)
                                        formik.setFieldValue(
                                          "description",
                                          e.target.value
                                        )
                                      }}
                                      value={formik.values.description || ""}
                                      maxLength="225"
                                      rows="3"
                                      placeholder={t("Note")}
                                    />
                                    {textareabadge ? (
                                      <span className="badgecount badge bg-success">
                                        {" "}
                                        {textcount} / 225{" "}
                                      </span>
                                    ) : null}
                                  </div>
                                </Col>
                              </Row>
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>

                  {!isEditIntern && (
                    <Card style={{ minWidth: "1100px" }}>
                      <CardBody className="bg-light">
                        <h4 className="fw-bold">{t("Contact Information")}</h4>
                        <Row className="border border-secondary mt-3">
                          <div>
                            <Row className="bg-secondary text-light">
                              <Col lg={12} sm={12}>
                                <Row>
                                  <Col
                                    lg={2}
                                    sm={2}
                                    className="text-center mt-2 fw-bold"
                                  >
                                    <p>{t("Country")}</p>
                                  </Col>
                                  <Col
                                    lg={2}
                                    sm={2}
                                    className="text-center mt-2 fw-bold"
                                  >
                                    <p>{t("Province")}</p>
                                  </Col>
                                  <Col
                                    lg={2}
                                    sm={2}
                                    className="text-center mt-2 fw-bold"
                                  >
                                    <p>{t("District")}</p>
                                  </Col>
                                  <Col
                                    lg={2}
                                    sm={2}
                                    className="text-center mt-2 fw-bold"
                                  >
                                    <p>{t("Ward")}</p>
                                  </Col>
                                  <Col
                                    lg={3}
                                    sm={3}
                                    className="text-center mt-2 fw-bold"
                                  >
                                    <p>{t("House Number, Street, etc.")}</p>
                                  </Col>
                                  <Col
                                    lg={1}
                                    sm={1}
                                    className="text-center mt-2 fw-bold"
                                  >
                                    <p>{t("Default address")}</p>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </div>

                          {addressDataIntern.map((address, index) => {
                            return (
                              <Row
                                className="mt-2"
                                key={index}
                                id={"nested" + index}
                              >
                                <Col lg={12}>
                                  <div>
                                    <Row>
                                      <Col
                                        lg={2}
                                        sm={2}
                                        className="d-flex justify-content-between gap-2 mt-2"
                                      >
                                        <div className="mb-3">
                                          <CloseButton
                                            className="mt-2"
                                            onClick={() => {
                                              handleDeleteColumn(index)
                                            }}
                                          />
                                        </div>
                                        <div className="mb-3 w-100">
                                          <Select
                                            name="nation_id"
                                            placeholder={t("Country")}
                                            // value={selectNation}
                                            onChange={item => {
                                              setSelectNation(item)
                                              const arr = [...addressDataIntern]
                                              arr[index] = {
                                                ...arr[index],
                                                nation_id: item.value,
                                              }
                                              updateAddressDataIntern(arr)
                                            }}
                                            options={optionGroup}
                                            className="w-100"
                                          />
                                        </div>
                                      </Col>

                                      <Col lg={2} sm={2} className="mt-2">
                                        <div className="mb-3">
                                          <Select
                                            name="province_id"
                                            placeholder={t("Province")}
                                            // value={selectProvince || ""}
                                            defaultValue={
                                              isEditIntern
                                                ? provinceOptions.find(
                                                    item =>
                                                      item.StateID ==
                                                      address.province_id
                                                  )
                                                : ""
                                            }
                                            // value={provinceOptions.find(item => item.StateID == address.province_id) || ''}
                                            onChange={item => {
                                              setSelectProvince(item)
                                              const arr = [...addressDataIntern]
                                              arr[index] = {
                                                ...arr[index],
                                                province_id: item.StateID,
                                              }
                                              updateAddressDataIntern(arr)
                                            }}
                                            options={provinceOptions}
                                            // isClearable
                                          />
                                        </div>
                                      </Col>

                                      <Col lg={2} sm={2} className="mt-2 ">
                                        <div className="mb-3">
                                          <Select
                                            name="district"
                                            placeholder={t("District")}
                                            // value={districtOptions.find(item => item.DistrictID == address.district_id) || ''}
                                            defaultValue={
                                              isEditIntern
                                                ? districtOptions.find(
                                                    item =>
                                                      item.DistrictID ==
                                                      address.district_id
                                                  )
                                                : ""
                                            }
                                            onChange={item => {
                                              setSelectDistrict(item)
                                              const arr = [...addressDataIntern]
                                              arr[index] = {
                                                ...arr[index],
                                                district_id: item.DistrictID,
                                              }
                                              updateAddressDataIntern(arr)
                                            }}
                                            options={districtOptions}
                                            className="select2-selection"
                                            // isClearable
                                          />
                                        </div>
                                      </Col>

                                      <Col lg={2} sm={2} className="mt-2">
                                        <div className="mb-3">
                                          <Select
                                            name="commune"
                                            placeholder={t("Ward")}
                                            // value={communeOptions.find(item => item.WardID == address.commune_id) || ''}
                                            defaultValue={
                                              isEditIntern
                                                ? communeOptions.find(
                                                    item =>
                                                      item.WardID ==
                                                      address.commune_id
                                                  )
                                                : ""
                                            }
                                            onChange={item => {
                                              setSelectCommune(item)
                                              const arr = [...addressDataIntern]
                                              arr[index] = {
                                                ...arr[index],
                                                commune_id: item.WardID,
                                              }
                                              updateAddressDataIntern(arr)
                                            }}
                                            options={communeOptions}
                                            className="select2-selection"
                                            // isClearable
                                          />
                                        </div>
                                      </Col>

                                      <Col
                                        lg={3}
                                        sm={3}
                                        className="mt-2 fw-bold"
                                      >
                                        <div className="mb-3">
                                          <Input
                                            name="detail"
                                            type="text"
                                            placeholder={t(
                                              "House Number, Street, etc."
                                            )}
                                            value={address.detail || ""}
                                            onChange={e => {
                                              const arr = [...addressDataIntern]
                                              arr[index] = {
                                                ...arr[index],
                                                detail: e.target.value,
                                              }
                                              updateAddressDataIntern(arr)
                                            }}
                                          />
                                        </div>
                                      </Col>

                                      <Col
                                        lg={1}
                                        sm={1}
                                        className="d-flex justify-content-center"
                                      >
                                        <div className="ms-2">
                                          <input
                                            className="form-check-input"
                                            type="radio"
                                            name="exampleRadios"
                                            id={`radio-${index}`}
                                            value={index}
                                            style={{ marginTop: "12px" }}
                                            onChange={handleChangeDefault}
                                          />
                                          <UncontrolledTooltip
                                            placement="top"
                                            target={`radio-${index}`}
                                          >
                                            {t("Default address")}
                                          </UncontrolledTooltip>
                                        </div>
                                      </Col>
                                    </Row>
                                  </div>
                                </Col>
                              </Row>
                            )
                          })}
                          <Row className="mb-2 mt-2">
                            <Col lg={6} className="d-flex gap-2">
                              <Button
                                onClick={handleAddForm}
                                color="secondary"
                                className="ms-4"
                              >
                                <i
                                  className="mdi mdi-plus font-size-18"
                                  id="deletetooltip"
                                />
                              </Button>
                            </Col>
                          </Row>
                        </Row>
                      </CardBody>
                    </Card>
                  )}

                  
                  {isEditIntern && (
                    <Card>
                      <CardBody>
                        {isRefresh && <AddressDatas item={item} user={user}/>}
                        {!isRefresh && (
                          <div className="d-flex gap-3 mt-1 ">
                            <h4 className="fw-bold text-success">
                              update data
                            </h4>{" "}
                            <Spinner
                              type="grow"
                              size="sm"
                              className="ms-2 mt-1"
                              color="primary"
                            />{" "}
                          </div>
                        )}
                      </CardBody>
                    </Card>
                  )}

                  {/* </CardBody> */}
                </Card>
              </Col>
            </Row>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={() => {
                item = null
                formik.resetForm({ values: formik.initialValues })
                setIsEditIntern(false)
                updateAddressDataIntern([])
                setselectedMultiStatus([])
                setOn(false)
                setSelectedFile(null)
                tog_fullscreen()
              }}
              className="btn btn-secondary "
              style={{ minWidth: "80px" }}
              data-dismiss="modal"
            >
              {t("Cancel")}
            </button>
            <button
              type="button"
              className="btn btn-primary "
              onClick={handleSubmit}
              style={{ minWidth: "100px" }}
            >
              {t("Save")}
            </button>
            {/* <button
              onClick={() => {
                tog_resresh()
              }}
            >
              refresh
            </button> */}
          </div>
        </Modal>
      </Form>
    </>
  )
}

ModalDatas.propTypes = {
  t: PropTypes.any,
}

// export default ModalDatas;
export default withTranslation()(ModalDatas)
