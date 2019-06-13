<template>
    <div class="warehouse">
        <nav class="product-top">
            <el-button type="primary" @click="isShow = true">添加原料信息</el-button>
            <div class="top-serarch">
                <el-input class="search-input" v-model="materialSearchInput" placeholder="请输入搜索内容..."></el-input>
                <el-button type="primary" @click="handleSearchMaterial">搜索</el-button>
            </div>
            <!-- emmm, show created -->
            <el-dialog
                title="添加原料信息"
                :visible.sync="isShow"
                @close="handleClose"
                width="30%">
                <el-form label-position="right" label-width="80px" :model="formLabel">
                    <el-form-item label="原料名称">
                        <el-input v-model="formLabel.name"></el-input>
                    </el-form-item>
                    <el-form-item label="仓库件数">
                        <el-input v-model="formLabel.number"></el-input>
                    </el-form-item>
                    <el-form-item label="厂家">
                        <el-input v-model="formLabel.factory"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号">
                        <el-input v-model="formLabel.mobile"></el-input>
                    </el-form-item>
                    <el-form-item label="每件钱数">
                        <el-input v-model="formLabel.money"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="isShow = false">取 消</el-button>
                    <el-button type="primary" @click="handleCreateMaterial">确 定</el-button>
                </span>
            </el-dialog>
        </nav>
        <el-table
            :data="tableData"
            style="width: 100%">
            
            <el-table-column
                label="原料名称">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.Name }}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="Factory"
                label="厂家">
            </el-table-column>
            <el-table-column
                prop="mobile"
                label="电话号码">
            </el-table-column>
            <el-table-column
                prop="Number"
                label="仓库-包/件数">
            </el-table-column>
            <el-table-column
                prop="Money"
                label="每包/件/钱">
            </el-table-column>
            <el-table-column
                prop="Date"
                label="录入时间">
            </el-table-column>
            <el-table-column
                label="编辑"
                width="180">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            title="修改存库信息"
            :visible.sync="isUpdata"
            @close="handleUpdataClose"
            width="30%">
            <el-form label-position="right" label-width="80px" :model="UpdataModel">
                <el-form-item label="原料名称">
                        <el-input v-model="UpdataModel.name"></el-input>
                    </el-form-item>
                    <el-form-item label="仓库件数">
                        <el-input v-model="UpdataModel.number"></el-input>
                    </el-form-item>
                    <el-form-item label="厂家">
                        <el-input v-model="UpdataModel.factory"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号">
                        <el-input v-model="UpdataModel.mobile"></el-input>
                    </el-form-item>
                    <el-form-item label="每件钱数">
                        <el-input v-model="UpdataModel.money"></el-input>
                    </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isUpdata = false">取 消</el-button>
                <el-button type="primary" @click="handleUpdataMaterial">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from "vue-property-decorator";
import { post, get, deletes, put } from '../../utils/http';

@Component({
  components: {},
})
export default class Material extends Vue {
    @Provide() public isShow: boolean = false;
    @Provide() public isUpdata: boolean = false;
    @Provide() public materialSearchInput: string = "";
    @Provide() public formLabel: any = {
        name: '',
        number: '',
        factory: "",
        mobile: "",
        money: "",
        date: "",
    };
    @Provide() public UpdataModel: any = {
        id: "",
        name: '',
        number: '',
        factory: "",
        mobile: "",
        money: "",
    };
    @Provide() public tableData: any = [];

    // 搜索
    private async handleSearchMaterial() {
        const response = await get("/material/list?name=" + this.materialSearchInput);
        if (response.data.code === "200") {
            for (const item of response.data.data) {
                item.Date = item.Date.split("T")[0];
            }
            this.tableData = response.data.data;
            this.$message.success(response.data.msg);
        } else {
            this.$message.warning(response.data.msg);
        }
    }

    // 关闭添加
    private handleClose() {
        this.formLabel.name = "";
        this.formLabel.number = "";
        this.formLabel.factory = "";
        this.formLabel.mobile = "";
        this.formLabel.money = "";
    }

    // 确定添加
    private async handleCreateMaterial() {
        const data = {
            name: this.formLabel.name,
            number: this.formLabel.number,
            factory: this.formLabel.factory,
            mobile: this.formLabel.mobile,
            money:  this.formLabel.money,
        };
        const response = await post("/material/list", data);
        if (response.data.code === "200") {
            this.$message.success("添加成功");
            this.isShow = false;
            this.initLoad();
        } else {
            this.$message.info("添加失败");
        }
        this.handleClose();
    }

    // 修改
    private handleEdit(index: any, row: any) {
        this.isUpdata = true;
        this.UpdataModel.name = row.Name;
        this.UpdataModel.number = row.Number;
        this.UpdataModel.id = row.id;
        this.UpdataModel.factory = row.factory;
        this.UpdataModel.mobile = row.mobile;
        this.UpdataModel.money = row.money;
    }

    // 修改关闭
    private handleUpdataClose() {
        this.UpdataModel.name = "";
        this.UpdataModel.number = "";
        this.UpdataModel.id = "";
        this.UpdataModel.factory = "";
        this.UpdataModel.mobile = "";
        this.UpdataModel.money = "";
    }

    // 修改确定
    private async handleUpdataMaterial() {
        const response = await put("/material/list", this.UpdataModel);
        if (response.data.code === "200") {
            this.$message.success(response.data.msg);
            this.isUpdata = false;
            this.initLoad();
        } else {
            this.$message.success(response.data.msg);
        }
    }

    // 删除原料信息
    private async handleDelete(index: any, row: any) {
        const response = await deletes("/material/list?id=" + row.id);
        if (response.data.code === "200") {
            this.$message.success("删除成功");
            this.initLoad();
        } else {
            this.$message.success(response.data.msg);
        }
    }

    private async initLoad() {
        const response = await get("/material/list");
        if (response.data.code === "200") {
            for (const item of response.data.data) {
                item.Date = item.Date.split("T")[0];
            }
            this.tableData = response.data.data;
        } else {
            this.$message.warning(response.data.msg);
        }
    }

    private created() {
        this.initLoad();
    }

}
</script>

<style lang="scss" scoped>
@import "../../assets/style/init";

</style>
