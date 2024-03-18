import React, { useState, useEffect, useContext } from 'react';
import { FilterMatchMode, FilterService } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { TabMenu } from 'primereact/tabmenu';

import DataContext from 'data/DataContext';

import DeleteModal from "components/Common/DeleteModal";
import ModalDatas from './ModalDatas'

// //redux
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { getInternAll, updateIntern, deleteIntern, setIntern, getStatusAll } from "store/actions";

// The rule argument should be a string in the format "custom_[field]".
FilterService.register('custom_activity', (value, filters) => {
  const [from, to] = filters ?? [null, null];
  if (from === null && to === null) return true;
  if (from !== null && to === null) return from <= value;
  if (from === null && to !== null) return value <= to;
  return from <= value && value <= to;
});

const TableDatas = () => {

  const { vh } = useContext(DataContext);

  const [selectedItems, setSelectedItems] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    factory: { value: null, matchMode: FilterMatchMode.CONTAINS },
    company: { value: null, matchMode: FilterMatchMode.CONTAINS },
    residence: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  const dispatch = useDispatch();

  // Khai bao du lieu
  const { internDataAll, statusData } = useSelector(state => ({
    internDataAll: state.Intern.datas,
    statusData: state.Status.datas
  }), shallowEqual);

  // Get du lieu lan dau 
  useEffect(() => {
    dispatch(getInternAll());
    dispatch(getStatusAll());
    setLoading(false);
  }, [dispatch]);

  // get lai data sau moi 10s
  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(getInternAll());
    }, 10000);
    // Hàm dọn dẹp khi unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // modal edit or addnew
  const [isEdit, setIsEdit] = useState(false);
  const [modal_xlarge, setmodal_xlarge] = useState(false);
  function tog_xlarge() {
    setmodal_xlarge(!modal_xlarge);
    removeBodyCss();
  }
  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }

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

  // Row selected edit
  const [rowSelect, setRowSelect] = useState(null)

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const [activeIndex, setActiveIndex] = useState(3);

  const rendLabel = () => {
    return statusData.map((item) => {
      return {label: item.name}
    }) 
  }

  const items = rendLabel();

  console.log(items)
  const renderHeader = () => {
    return (
      <div className='d-flex justify-content-between'>
        <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
       
        
      </div>
    );
  };

  const addForm = () => {
    setRowSelect(null);
    setIsEdit(false);
    tog_xlarge();
  }



  const actionBody = (rowData) => {
    return (
      <div className="d-flex gap-3">
        <Button icon="pi pi-pencil" rounded text severity="success" aria-label="Cancel" onClick={() => { setRowSelect(rowData); tog_xlarge(); setIsEdit(true) }} />
        <Button icon="pi pi-trash" rounded text severity="danger" aria-label="Cancel" onClick={() => { onClickDelete(rowData); }} />
      </div>
    )
  }

  const header = renderHeader();

  return (
    <div className="card" >
      <DataTable value={internDataAll} paginator rows={15} stripedRows rowsPerPageOptions={[5, 10, 15, 20, 50]} dragSelection selectionMode={'multiple'} selection={selectedItems} onSelectionChange={(e) => setSelectedItems(e.value)} dataKey="id" filters={filters}
        filterDisplay="row" loading={false} globalFilterFields={['id', 'name', 'description']} header={header} emptyMessage="Không tìm thấy kết quả phù hợp." tableStyle={{ minWidth: '50rem' }} scrollable scrollHeight={vh} size={'small'} s>
        <Column selectionMode="multiple" exportable={false} headerStyle={{ width: '3rem' }} ></Column>
        <Column field="name" header="Tên thực tập sinh" filterField="name" filter filterPlaceholder="Tìm kiếm bằng tên" sortable style={{ minWidth: '12rem' }} ></Column>
        <Column field="factory" header="Xí nghiệp" filterField="factory" filter filterPlaceholder="Tìm kiếm bằng tên" sortable style={{ minWidth: '12rem' }} ></Column>
        <Column field="company" header="Phái cử" filterField="company" filter filterPlaceholder="Tìm kiếm bằng tên" sortable style={{ minWidth: '12rem' }} ></Column>
        <Column field="residence" header="Tư cách lưu trú" filterField="residence" filter filterPlaceholder="Tìm kiếm bằng tên" sortable style={{ minWidth: '12rem' }} ></Column>
        <Column field="status" header="Trạng thái" filter filterField="status" filterPlaceholder="tìm kiếm bằng mô tả" showFilterMenu={true} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }} ></Column>
        <Column field="action" header="Action" style={{ minWidth: '14rem' }} body={actionBody} ></Column>
      </DataTable>

      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteOrder}
        onCloseClick={() => setDeleteModal(false)}
      />

      <ModalDatas
        item={rowSelect}
        isEdit={isEdit}
        modal_xlarge={modal_xlarge}
        setmodal_xlarge={setmodal_xlarge}
        tog_xlarge={tog_xlarge}
        dispatch={dispatch}
        setApi={setIntern}
        updateApi={updateIntern}
      />

    </div>
  );
}

export default TableDatas;