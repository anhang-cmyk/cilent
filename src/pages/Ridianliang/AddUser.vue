<template>
  <div class="addUserMain">
    <div @click="login">登录</div>
    <div class="header">
      <div>
        <el-button type="primary" size="mini" @click="onExport">导出</el-button>
        <el-upload class="upload-demo" action="http://10.96.2.219:8080/user/bind/91310110MA1G8C0L1F" :on-preview="handlePreview" :on-success="handleSuccess" :multiple="false" :data="{ companyNo: '91310110MA1G8C0L1F' }" :show-file-list="false">
          <el-button type="primary" size="mini">快速绑定</el-button>
        </el-upload>
      </div>
    </div>
    <div class="content"><EleTable :tableData="tableData" :tableColumn="tableColumn" /></div>
  </div>
</template>

<script>
import { EleTable } from 'src/components/index';
import axios from 'axios';
// import XLSX from 'XLSX';

export default {
  name: 'AddUser',
  components: { EleTable },
  data() {
    return {
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          userName: Math.random() * 1000,
          address: '上海市普陀区金沙江路 1518 弄',
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          userName: Math.random() * 1000,
          address: '上海市普陀区金沙江路 1517 弄',
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          userName: Math.random() * 1000,
          address: '上海市普陀区金沙江路 1519 弄',
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          userName: Math.random() * 1000,
          address: '上海市普陀区金沙江路 1516 弄',
        },
      ],
      tableColumn: [
        { prop: 'date', label: '用户名称' },
        { prop: 'name', label: '户号' },
        { prop: 'address', label: '失效状态' },
        { prop: 'userName', label: '绑定状态' },
      ],
      logined: false,
    };
  },
  mounted() {
    window.renderingOnce.outPowerGrid(this.outPowerGrid);
    window.renderingOnce.loginedPowerGrid(this.loginedPowerGrid);
  },
  methods: {
    handlePreview(file) {
      console.log(file);
    },
    handleSuccess(response, file, fileList) {
      console.log(response, file, fileList);
      window.renderingOnce.taskCreatPage('taskCode');
    },
    async onExport(companyNo = '91310110MA1G8C0L1F') {
      const postRes = await axios.get(`http://10.96.2.219:8080/user/export/91310110MA1G8C0L1F`);
      console.log(postRes.data);
      const url = window.URL.createObjectURL(new Blob([postRes.data]), { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', 'response.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    login() {
      if (this.logined) {
        this.$q.notify({
          message: `已登录，请勿重复点击！`,
          type: 'info',
          position: 'center',
        });
      }
      window.renderingSend.loginPowerGrid();
    },
    outPowerGrid(msg) {
      console.log(msg);
    },
    loginedPowerGrid(msg) {
      console.log(msg);
      this.logined = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.addUserMain {
  width: 100%;
  height: 100%;
  .header {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    > div {
      display: flex;
      button {
        margin-left: 8px;
      }
    }
  }
  .content {
    margin-top: 16px;
  }
}
</style>
