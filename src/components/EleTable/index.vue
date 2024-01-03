<template>
  <el-table :data="tableData" style="width: 100%" stripe border max-height="250" size="mini">
    <el-table-column v-for="item in tableColumn" :key="`${item.prop}-${item.label}`" :prop="item.prop" :label="item.label" :width="item.width"> </el-table-column>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes || [20, 50, 100, 200]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400"> </el-pagination>
  </el-table>
</template>

<script>
export default {
  name: 'EleTable',
  props: ['tableData', 'tableColumn', 'pageSizes'],
  data() {
    return {
      total: 1,
      currentPage: 1,
    };
  },
  methods: {
    handleSizeChange: (size) => {
      console.log(`每页 ${size} 条`);
    },
    handleCurrentChange: (currentPage) => {
      console.log(`当前页: ${currentPage}`);
    },
  },
};
</script>
