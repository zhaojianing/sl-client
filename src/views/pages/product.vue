<template>
    <div class="main">
        <nav class="product-top">
            <el-button type="primary" @click="isShow = true">创建产品</el-button>
            <div class="top-serarch">
                <el-input class="search-input" v-model="productSearchInput" placeholder="请输入搜索内容..."></el-input>
                <el-button type="primary" @click="handleSearchProduct">搜索</el-button>
            </div>
            <!-- emmm, show created -->
            
        </nav>
        <!-- 创建产品 -->
        <el-dialog
            title="创建产品信息"
            :visible.sync="isShow"
            @close="handleClose"
            width="30%">
            <el-form label-position="right" label-width="80px" :model="formLabel">
                <el-form-item label="图片上传">
                    <el-upload
                    class="avatar-uploader"
                    action="http://127.0.0.1:5001/upload/img"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess">
                        <img v-if="imgurlUpLoadIf" :src="imgurlUpLoad" class="avatar dialog-img">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="formLabel.name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShow = false">取 消</el-button>
                <el-button type="primary" @click="handleCreateProduct">确 定</el-button>
            </span>
        </el-dialog>
        <main class="main-tpl-main">  
            <div v-if="mainBox.length > 0" class="main-tpl-parent">
                <div class="main-tpl" v-for="item in mainBox" :key="item.id">
                    <div class="main-tpl-delete">
                        <el-button type="primary" icon="el-icon-picture" @click="lookBigImg(item.ImgUrl)" circle></el-button>
                        <el-button type="danger" icon="el-icon-delete" @click="deleteProduct(item.id)" circle></el-button>
                    </div>
                    <img class="main-tpl-img" :src="item.ImgUrl">
                    <p>
                        {{ item.Name }}
                    </p>
                </div>
            </div>
            <div v-else class="main-tpl-nomal">
                <h1> 无产品 </h1>
                <p> 请先创建产品! </p>
            </div>
        </main>
        <!-- 查看图片 -->
        <el-dialog
            title="查看大图"
            :visible.sync="isBigImg"
            @before-close="handleCloseLookBigImg"
            width="80%"
            top="0"
            class="look-img">
            <el-image
                style="width:600px; height: 600px"
                :src="bigImgUrl"
                fit="contain">
            </el-image>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from "vue-property-decorator";
import { post, get, deletes } from '../../utils/http';

@Component({
  components: {},
})
export default class Product extends Vue {
    @Provide() public productSearchInput: string = '';
    @Provide() public isShow: boolean = false;
    @Provide() public isBigImg: boolean = false;
    @Provide() public imgurlUpLoad: string = "";
    @Provide() public bigImgUrl: string = "";
    @Provide() public imgurlUpLoadIf: boolean = false;
    @Provide() public formLabel: any = {
        name: '',
    };
    @Provide() public mainBox: object = [];
    // 图片上传
    public handleAvatarSuccess(response: any, file: any, fileList: any) {
        if (response.code === "200") {
            this.imgurlUpLoadIf = true;
            // 文件名称
            const fileNames = file.name.split(".");
            delete fileNames[fileNames.length - 1];
            this.formLabel.name = fileNames.join("");
            // 返回的网络地址
            this.imgurlUpLoad = "http://localhost:5001/static/upload/" + response.data;
            // this.$message.success(response.msg);
        } else {
            this.$message.warning(response.msg);
        }
    }
    // 关闭清楚上次缓存信息
    public handleClose() {
        this.imgurlUpLoad = "";
        this.imgurlUpLoadIf = false;
        this.formLabel.name = "";
    }
    // 创建产品
    public async handleCreateProduct() {
        const data = {
            imgname: this.formLabel.name,
            imgurl: this.imgurlUpLoad,
        };
        const response = await post('/product', data);
        if (response.data.code === "200") {
            this.$message.success("创建成功!");
            this.handleClose();
            // 刷新主页
            this.initLoad();
            // 关闭创建
            this.isShow = false;
        } else {
            this.$message.success(response.data.msg);
        }
    }
    // 首次加载
    private async initLoad() {
        const response = await get('/product/list');
        if (response.data.code === "200") {
            this.mainBox = response.data.data;
        } else {
            this.$message.warning(response.data.msg);
        }
    }
    // 搜索
    private async handleSearchProduct() {
        const data = {name: this.productSearchInput};
        const response = await post('/product/list', data);
        if (response.data.code === "200") {
            this.mainBox = response.data.data;
        } else {
            this.$message.warning(response.data.msg);
        }
    }
    // 查看大图
    private lookBigImg(url: string) {
        this.isBigImg = true;
        this.bigImgUrl = url;
    }
    // 关闭查看
    private handleCloseLookBigImg() {
        this.isBigImg = false;
        this.bigImgUrl = "";
    }
    private async deleteProduct(id: number) {
        const reponse = await deletes('/product/list?id=' + id);
        if (reponse.data.code === "200") {
            this.$message.success(reponse.data.data);
        } else {
            this.$message.warning(reponse.data.data);
        }
        this.initLoad();
    }
    // 钩子
    private created() {
        // 首次加载
        this.initLoad();
    }
}
</script>

<style lang="scss" scoped>
@import "../../assets/style/init";
.main {
    overflow-y: scroll;
    width: 100%;
    height: 100%;
    
    .main-tpl-main {
        height: 500px;
        .main-tpl-parent {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-between;
            .main-tpl {
                width: 30%;
                height: 300px;
                overflow: hidden;
                text-align: center;
                font-weight: bold;
                border: 1px solid #ccc;
                margin-bottom: 10px;
                background-color: #404040;
                color: #ccc;
                position: relative;
                .main-tpl-delete {
                    display: inline-block;
                    position: absolute;
                    top: 0;
                    right: 0;
                }
                .main-tpl-img {
                    width: 100%;
                    height: 80%;
                }
            }
        }
        .main-tpl-nomal {
            text-align: center;
        }
    }
    .dialog-img {
        width: 100%;
    }
    .look-img {
        // height: 100%;
        text-align: center;
    }
}
</style>
