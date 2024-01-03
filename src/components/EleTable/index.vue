<template>
  <div style="height: 100%" ref="tableRef">
    <el-table :data="tableData" style="width: 100%" stripe border :max-height="(tableHeight || 600) - 20" size="mini">
      <el-table-column v-for="item in tableColumn" :key="`${item.prop}-${item.label}`" :prop="item.prop" :label="item.label" :width="item.width">
        <template v-slot="scope">
          {{ item?.render?.({ row: scope.row, val: scope.row[`${item.prop}`] }) || scope.row[`${item.prop}`] }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>


    <!-- <div style="display: flex; justify-content: flex-end; margin-top: 10px">
      <el-pagination small @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes || [20, 50, 100, 200]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div> -->
<script>
export default {
  name: 'EleTable',
  props: ['tableData', 'tableColumn', 'pageSizes', 'total'],
  data() {
    return {
      pageSize: 20,
      currentPage: 1,
      tableHeight: 0,
    };
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  methods: {
    handleResize() {
      this.tableHeight = this.$refs.tableRef?.clientHeight;
    },
    handleSizeChange(size) {
      this.pageSize = size;
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
    },
  },
};
</script>
