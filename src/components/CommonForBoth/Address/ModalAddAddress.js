import React, { useState, useEffect, useContext } from "react"
import { Card, CardBody, Modal, Label, Input } from "reactstrap"

import Select from "react-select"

import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

// import context
import DataContext from "data/DataContext"

// //redux
import { useSelector, useDispatch, shallowEqual } from "react-redux"
import {
  getProvinceByNationId,
  getDistrictByProvinceId,
  getCommuneByDistrictId,
  getProvinceId,
  getDistrictId,
  getCommuneId,
  updateAddress,
} from "store/actions"

const optionGroup = [
  { label: "Vietnam", value: 1 },
  { label: "Japan", value: 2 },
  // { label: "Korea", value: 3 },
]

import moment from "moment"

const ModalAddAddress = ({ item, isAddDetail, setIsAddDetail }) => {
  // data context
  const {
    tog_standard,
    modal_standard,
    setmodal_standard,
    isRefresh,
    updateRefresh,
    tog_resresh,
    modal_add_address,
    tog_add_address,
    setmodal_add_address,
  } = useContext(DataContext)

  const { t } = useTranslation()

  const dispatch = useDispatch()

  const {
    provinceDataByNationId,
    districtDataByProvinceId,
    communeDataByDistrictId,
    provinceDataId,
    districtDataId,
    communeDataId,
  } = useSelector(
    state => ({
      provinceDataByNationId: state.Province.dataByNationId,
      districtDataByProvinceId: state.District.dataByProvinceId,
      communeDataByDistrictId: state.Commune.dataByDistrictId,
      provinceDataId: state.Province.dataId,
      districtDataId: state.District.dataId,
      communeDataId: state.Commune.dataId,
    }),
    shallowEqual
  )

  // Get du lieu lan dau
  useEffect(() => {
    // dispatch(getProvinceByNationId(address.nation_id))
    // dispatch(getDistrictByProvinceId(address.province_id))
    // dispatch(getCommuneByDistrictId(address.district_id))
    // dispatch(getProvinceId(address.province_id))
    // dispatch(getDistrictId(address.district_id))
    // dispatch(getCommuneId(address.commune_id))
  }, [dispatch, isAddDetail])

  // render lua chon tinh, huyen, xa
  const [selectNation, setSelectNation] = useState("")
  const [selectProvince, setSelectProvince] = useState("")
  const [selectDistrict, setSelectDistrict] = useState("")
  const [selectCommune, setSelectCommune] = useState("")
  const [detail, setDetail] = useState("")

  const [provinceOptions, setProvinceOptions] = useState("")
  const [districtOptions, setDistrictOptions] = useState("")
  const [communeOptions, setCommuneOptions] = useState("")

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
      setProvinceOptions(provinceDataByNationId)
    }
  }, [provinceDataByNationId])

  //---------------------------------------------------------------------------------------

  // Xu ly danh sach district
  useEffect(() => {
    if (selectProvince !== "") {
      dispatch(getDistrictByProvinceId(selectProvince.StateID))
      // setSelectDistrict("")
    }
  }, [selectProvince])

  useEffect(() => {
    if (districtDataByProvinceId !== "") {
      setDistrictOptions(districtDataByProvinceId)
    }
  }, [districtDataByProvinceId])

  //---------------------------------------------------------------------------------------
  // xu ly tai danh sach commune
  useEffect(() => {
    if (selectDistrict !== "") {
      dispatch(getCommuneByDistrictId(selectDistrict.DistrictID))
      // setSelectCommune("")
    }
  }, [selectDistrict])

  useEffect(() => {
    if (communeDataByDistrictId !== "") {
      setCommuneOptions(communeDataByDistrictId)
    }
  }, [communeDataByDistrictId])
  //---------------------------------------------------------------------------------------

  //   Xac dinh ham thuc thi
  const handleSave = () => {
    address.nation_id = selectNation.value
    address.province_id = selectProvince.ProviceID
    address.district_id = selectDistrict.DistrictID
    address.commune_id = selectCommune.WardID
    address.detail = detail

    dispatch(updateAddress(address))
    setSelectNation(null)
    setSelectProvince(null)
    setSelectDistrict(null)
    setSelectCommune(null)
    setIsAddDetail(false)
    tog_resresh()
    tog_standard()
  }

  // console.log('address', address)
  // console.log("communeDataId", communeDataId)
  // console.log('address', address)
  console.log("item", item)

  return (
    <>
      {isAddDetail && (
        <Modal
          isOpen={modal_standard}
          toggle={() => {
            tog_standard()
          }}
        >
          <div className="modal-header bg-primary">
            <h4 className="modal-title mt-0 text-light" id="myModalLabel">
              {t("Add Address Information")}
            </h4>
            <button
              type="button"
              onClick={() => {
                setmodal_standard(false)
              }}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <Card>
            <CardBody>
              <div className="mb-3 w-100">
                <Label htmlFor="nation_id" className="form-label fw-bold">
                  {t("Country")}
                </Label>
                <Select
                  id="nation_id"
                  name="nation_id"
                  placeholder={t("Country")}
                  value={selectNation}
                  onChange={item => {
                    setSelectNation(item)
                  }}
                  options={optionGroup}
                  className="w-100"
                />
              </div>

              <div className="mb-3 w-100">
                <Label htmlFor="province_id" className="form-label fw-bold">
                  {t("Province")}
                </Label>
                <Select
                  id="province_id"
                  name="province_id"
                  placeholder={t("Province")}
                  value={selectProvince}
                  onChange={item => {
                    setSelectProvince(item)
                  }}
                  options={provinceOptions}
                  // isClearable
                />
              </div>

              <div className="mb-3">
                <Label className="form-label fw-bold">{t("District")}</Label>
                <Select
                  name="district"
                  placeholder={t("District")}
                  value={selectDistrict}
                  onChange={item => {
                    setSelectDistrict(item)
                  }}
                  options={districtOptions}
                  className="select2-selection"
                  // isClearable
                />
              </div>
              <div className="mb-3">
                <Label className="form-label fw-bold">{t("Ward")}</Label>
                <Select
                  name="commune"
                  placeholder={t("Ward")}
                  value={selectCommune}
                  onChange={item => {
                    setSelectCommune(item)
                  }}
                  options={communeOptions}
                  className="select2-selection"
                  // isClearable
                />
              </div>
              <div className="mb-3">
                <Label className="form-label fw-bold">
                  {t("House Number, Street, etc.")}
                </Label>
                <Input
                  name="detail"
                  type="text"
                  placeholder={t("House Number, Street, etc.")}
                  value={detail}
                  onChange={e => {
                    setDetail(e.target.value)
                  }}
                />
              </div>
            </CardBody>
          </Card>
          <div className="modal-footer">
            <button
              type="button"
              onClick={() => {
                tog_standard()
                setSelectNation(null)
                setSelectProvince(null)
                setSelectDistrict(null)
                setSelectCommune(null)
                setIsAddDetail(false)
              }}
              className="btn btn-secondary "
              data-dismiss="modal"
            >
              {t("Cancel")}
            </button>

            <button
              type="button"
              className="btn btn-primary "
              onClick={handleSave}
            >
              {t("Save")}
            </button>
          </div>
        </Modal>
      )}
    </>
  )
}

export default ModalAddAddress