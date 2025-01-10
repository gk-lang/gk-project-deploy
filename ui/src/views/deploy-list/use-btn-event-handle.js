import { ref } from "vue";
export default function useBtnEventHandle() {
  const searchFormData = ref({
    name1: "张三",
    name2: "A111",
  });
  const dialogAddOrEditIsShow = ref(false);
  const dialogAddOrEditData = ref({});
  const tableData = ref([
    {
      aaa1: "1111",
      aaa2: "2222",
      aaa3: "3333",
      aaa4: "4444",
    },
    {
      aaa1: "1111",
      aaa2: "2222",
      aaa3: "3333",
      aaa4: "4444",
    },
    {
      aaa1: "1111",
      aaa2: "2222",
      aaa3: "3333",
      aaa4: "4444",
    },
    {
      aaa1: "1111",
      aaa2: "2222",
      aaa3: "3333",
      aaa4: "4444",
    },
  ]);
  const tablePage = ref({
    total_num: 4,
    page_num: 1,
    page_size: 50,
  });
  const multipleSelection = ref([]);

  function searchTableData() {}
  function openDialogAddOrEdit(row) {
    dialogAddOrEditIsShow.value = true;
  }
  function handleDialogAddOrEditSave(){

  }
  function handlePageChange(page) {
    searchTableData();
  }
  function selectionChange(params) {
    multipleSelection.value = params.multipleSelection;
  }
  return {
    searchFormData,
    tableData,
    tablePage,
    dialogAddOrEditIsShow,
    dialogAddOrEditData,
    openDialogAddOrEdit,
    handleDialogAddOrEditSave,
    handlePageChange,
    selectionChange,
  };
}
