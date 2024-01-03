<template>
  <div class="addUserMain">
    <div @click="login">登录</div>
    <div class="header">
      <div>
        <el-button type="primary" size="mini" @click="handleExport">导出</el-button>
        <el-upload class="upload-demo" action="http://10.96.2.219:8080/user/bind/91310110MA1G8C0L1F" :on-preview="handlePreview" :on-success="handleSuccess" :multiple="false" :data="{ companyNo: '91310110MA1G8C0L1F' }" :show-file-list="false">
          <el-button type="primary" size="mini">快速绑定</el-button>
        </el-upload>
      </div>
    </div>
    <div class="content"><EleTable :tableData="tableData" :tableColumn="tableColumn" :total="total" /></div>
  </div>
</template>

<script>
import { EleTable } from 'src/components/index';
import axios from 'axios';

export default {
  name: 'AddUser',
  components: { EleTable },
  data() {
    return {
      total: 0,
      currentPage: 1,
      tableData: [],
      tableColumn: [
        { prop: 'consName', label: '用户名称' },
        { prop: 'consNo', label: '户号' },
        {
          prop: 'authEndDate',
          label: '失效状态',
          render: ({ val }) => {
            if (val === null) return '-';
            return `${!val ? '已失效' : '正常'}`;
            // return `<div style="color: ${!val ? '#ff4d4f' : '#52c41a'}">
            //   ${!val ? '已失效' : '正常'}
            // </div>`;
          },
        },
        {
          prop: 'status',
          label: '绑定状态',
          render: ({ val }) => {
            if (val === null) return '-';
            return `${!val ? '未绑定' : '已绑定'}`;
            // return `<div style="color: ${!val ? '#ff4d4f' : '#52c41a'}">${!val ? '未绑定' : 'F已绑定'}</div>`;
          },
        },
      ],
    };
  },
  mounted() {
    window.renderingOnce.outPowerGrid(this.outPowerGrid);
    window.renderingOnce.loginedPowerGrid(this.loginedPowerGrid);
    this.fetch({ companyNo: '91310110MA1G8C0L1F' });
  },
  methods: {
    async fetch({ companyNo }) {
      const getRes = await axios.get(`http://10.96.2.219:8080/user/get/${companyNo}`);
      if (getRes?.status === 200) {
        this.tableData = getRes.data || [];
        this.total = getRes.data?.length || 0;
      } else {
        this.$q.notify({
          message: getRes.message || `接口失败！`,
          type: 'error',
          position: 'center',
        });
      }
    },
    handlePreview(file) {
      console.log(file);
    },
    handleSuccess(response, file, fileList) {
      console.log(response, file, fileList);
      window.renderingOnce.taskCreatPage('taskCode');
    },
    async handleExport({ companyNo = '91310110MA1G8C0L1F' }) {
      const getRes = await axios.get(`http://10.96.2.219:8080/user/export/${companyNo}`, {
        responseType: 'blob',
      });
      const fileName = decodeURIComponent(getRes.headers['content-disposition']?.split('=')[1]);
      const link = document.createElement('a');
      const blob = new Blob([getRes.data], { type: 'application/vnd.ms-excel,charset=utf-8' });
      link.style.display = 'none';
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },
};
</script>

<style lang="scss" scoped>
.addUserMain {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
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
    flex: 1;
    overflow: hidden;
    margin-top: 16px;
  }
}
</style>
