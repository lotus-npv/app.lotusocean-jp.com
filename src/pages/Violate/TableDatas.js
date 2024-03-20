import React, { useState, useEffect, useContext } from 'react';
import { FilterMatchMode, FilterService } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
// import { TabMenu } from 'primereact/tabmenu';
import { Avatar } from 'primereact/avatar';
import { InputText } from 'primereact/inputtext';

import {
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
  Button as ButtonRS
} from "reactstrap";
import classnames from "classnames";

import { Badge } from "reactstrap";
import { Badge as BadgePrime } from 'primereact/badge';

import DataContext from 'data/DataContext';

import DeleteModal from "components/Common/DeleteModal";
import ModalDatas from './ModalDatas'

import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";

// //redux
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { getReceivingFactoryAll, getAddressAll, getProvinceId, getProvinceAll, getViolateAll, getViolateListAll, getUsersLogin } from "store/actions";

// The rule argument should be a string in the format "custom_[field]".
FilterService.register('custom_activity', (value, filters) => {
  const [from, to] = filters ?? [null, null];
  if (from === null && to === null) return true;
  if (from !== null && to === null) return from <= value;
  if (from === null && to !== null) return value <= to;
  return from <= value && value <= to;
});

const TableDatas = (props) => {
  // const [loading, setLoading] = useState(true);
  // data context
  const { vh, tog_fullscreen, isEdit, setIsEdit } = useContext(DataContext);

  //table


  // Khai bao du lieu
  const dispatch = useDispatch();

  const { violateListData,violateData, addressData, provinceById, provinceData, loading , user} = useSelector(state => ({
    violateListData: state.ViolateList.datas,
    violateData: state.Violate.datas,
    addressData: state.Address.datas,
    provinceById: state.Province.dataId,
    provinceData: state.Province.datas,
    loading: state.Province.loading,
    user: state.Users.datas
  }), shallowEqual);

  // Get du lieu lan dau 
  useEffect(() => {
    dispatch(getViolateListAll());
    dispatch(getViolateAll());
    dispatch(getProvinceAll());
    dispatch(getUsersLogin('admin', '123456'));
  }, [dispatch]);

  // get lai data sau moi 10s
  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(getViolateListAll());
    }, 10000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  console.log('user', user)

  // //delete modal
  const [item, setItem] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = (data) => {
    setItem(data);
    setDeleteModal(true);
  };

  const handleDeleteOrder = () => {
    if (item && item.id) {
      console.log('delete id :' + item.id);
      dispatch(deleteCareer(item.id));

      setDeleteModal(false);
    }
  };

  // TABLE 
  // render label tab
  const [activeIndex, setActiveIndex] = useState(0);

  const itemRenderer = (item, itemIndex, data) => (
    <a className="p-menuitem-link flex align-items-center gap-2" onClick={() => setActiveIndex(itemIndex)}>
      <BadgePrime value={data}></BadgePrime>
      <span className="font-bold">{props.t(item.name)}</span>
    </a>
  );

  const rendLabel = () => {
    // lọc ra danh sách các địa chỉ của xí nghiệp
    const array = addressData.filter(address => address.user_type === 'receiving_factory');

    // tạo danh sách địa
    const number_of_factory = array.filter(address => address.is_default == 1).length;
    // console.log('number_of_factory', number_of_factory)

    let map = new Map();
    array.forEach(obj => {
      if (!map.has(obj.province_id)) {
        map.set(obj.province_id, { data: 1, obj });
      } else {
        map.get(obj.province_id).data += 1;
      }
    });

    // let uniqueArray = Array.from(map.values()).map(({ data, obj }) => ({ ...obj.province_id, data }));
    // Tao mang chua du lieu 
    let uniqueArray = Array.from(map.values()).map(item => {
      let name = 'loading ...';
      if(!loading)  {
         let nation = provinceData.find(province => province.StateID == item.obj.province_id);
         if(nation !== undefined) {
            name = nation.StateName_ja;
         }
      }

      return { name: name, data: item.data, provinceId: item.obj.province_id }
    });

    return [{ name: 'All', data: number_of_factory, provinceById: 0 }, ...uniqueArray.map((address) => {
      return { name: address.name, data: address.data, provinceId: address.provinceId }
    })].filter(e => e.data >= 1);
  }

  // acctive tab
  const [customActiveTab, setcustomActiveTab] = useState({ index: "0", value: "All", id: 0 });
  const toggleCustom = (tab, data, provinceId) => {
    if (customActiveTab.index !== tab) {
      setcustomActiveTab({ index: tab, value: data, id: provinceId });
    }
  };

  // Global filter 

  const [selectedItems, setSelectedItems] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nam_jp: { value: null, matchMode: FilterMatchMode.CONTAINS },
    phone_number: { value: null, matchMode: FilterMatchMode.CONTAINS },
    date_of_joining_syndication: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  // Row selected edit
  const [rowSelect, setRowSelect] = useState(null)

  // Global search
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  // goi ham render mang data
  const items = rendLabel();
  // console.log('items', items)
  const renderHeader = () => {
    return (
      <>
        <Row className='mb-2'>
          <div className='d-flex justify-content-between'>
            <span className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Nhập từ khoá tìm kiếm ..." />
            </span>
            <ButtonRS color="primary" onClick={() => {
              setIsEdit(false);
              tog_fullscreen();
            }}>
              Thêm mới
            </ButtonRS>
          </div>
        </Row>
        <Row>
          <div className='d-flex justify-content-between'>
            {/* <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} /> */}
            <Nav tabs className="nav-tabs-custom">
              {items.map((item, index) => (
                <NavItem key={index} style={{ minWidth: '100px' }}>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({
                      active: customActiveTab.index === (`${index}`),
                    })}
                    onClick={() => {
                      toggleCustom(`${index}`, item.name, item.provinceId);
                    }}
                  >
                    <div className='d-flex gap-2 justify-content-center'>
                      <span className="d-none d-sm-block">{item.name}</span>
                      <Badge pill className={"p-2 font-size-12 badge-soft-primary"}>{item.data}</Badge>
                    </div>
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
          </div>
        </Row>
      </>
    );
  };


  const [dataTable, setDataTable] = useState(violateListData)

  const getListInternStatus = (key) => {
    console.log('key ', key)
    // const idStatus = statusData.find(item => item.name == key).id;
    const arr = addressData.filter(item => item.province_id == key);
    console.log('arr:', arr)
    const newList = violateListData.filter(factory => arr.some(item => item.object_id == factory.id && item.user_type == 'receiving_factory'));
    setDataTable(newList);
  }

  useEffect(() => {
    if (customActiveTab.value === 'All') {
      setDataTable(violateListData);
    } else {
      getListInternStatus(customActiveTab.id);
    }
  }, [customActiveTab, violateListData])

  // console.log('customActiveTab:', customActiveTab)

  // render col name
  const nameBodyTemplate = (rowData) => {
    return (
      <div className="flex align-items-center gap-2">
        <Avatar className="p-overlay-badge" image={`https://api.lotusocean-jp.com/uploads/${rowData.originalname}`} size="large" shape="circle">
        </Avatar>
        <span>{rowData.name_jp}</span>
      </div>
    );
  };


  const actionBody = (rowData) => {
    return (
      <div className="d-flex gap-3">
        <Button icon="pi pi-pencil" rounded text severity="success" aria-label="Cancel" onClick={() => { setRowSelect(rowData); tog_fullscreen(); setIsEdit(true) }} />
        <Button icon="pi pi-trash" rounded text severity="danger" aria-label="Cancel" onClick={() => { onClickDelete(rowData); }} />
      </div>
    )
  }

  const header = renderHeader();




  // console.log('loading:', loading)
  // console.log('provinceById:', provinceById)
  // console.log('provinceData:', provinceData)
  // console.log('violatelist:', violateListData);
  // console.log('violate:', violateData);
  // console.log('dataTable:', dataTable);

  return (
    <div className="card" >
      <DataTable value={dataTable} paginator rows={15} stripedRows rowsPerPageOptions={[5, 10, 15, 20, 50]} dragSelection selectionMode={'multiple'} selection={selectedItems} onSelectionChange={(e) => setSelectedItems(e.value)} dataKey="id" filters={filters}
        filterDisplay="row" globalFilterFields={['id', 'nam_jp', 'phone_number']} header={header} emptyMessage="Không tìm thấy kết quả phù hợp." tableStyle={{ minWidth: '50rem' }} scrollable scrollHeight={vh} size={'small'}>
        <Column selectionMode="multiple" exportable={false} headerStyle={{ width: '3rem' }} ></Column>
        <Column field="violate_date" header="Ngày vi phạm" filterField="nam_jp" filter filterPlaceholder="Tìm kiếm bằng tên" sortable style={{ minWidth: '12rem' }} ></Column>
        <Column field="violate_name" header="Loại vi phạm" filterField="factory_name_jp" filter filterPlaceholder="Tìm kiếm bằng tên" sortable style={{ minWidth: '12rem' }} ></Column>
        <Column field="number_of_intern_violate" header="Số người vi phạm" filterField="date_of_joining_syndication" filter filterPlaceholder="Tìm kiếm bằng tên" sortable style={{ minWidth: '12rem' }} ></Column>
        <Column field="description" header="Diễn giải" style={{ minWidth: '12rem' }} ></Column>
        <Column field="action" header="Thao tác" style={{ minWidth: '10rem' }} body={actionBody} ></Column>
      </DataTable>

      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteOrder}
        onCloseClick={() => setDeleteModal(false)}
      />

      <ModalDatas
        item={rowSelect}
        dispatch={dispatch}
      // setApi={setIntern}
      // updateApi={updateIntern}
      />

    </div>
  );
}

TableDatas.propTypes = {
  t: PropTypes.any,
};

export default withTranslation()(TableDatas);