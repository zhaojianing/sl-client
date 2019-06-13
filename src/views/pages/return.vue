<template>
    <div class="warehouse">
        <nav class="product-top">
            <el-button type="primary" @click="isShow = true">添加退货信息</el-button>
            <div class="top-serarch">
                <el-input class="search-input" v-model="returnSearchInput" placeholder="请输入退货产品..."></el-input>
                <el-button type="primary" @click="handleSearchReturn">搜索</el-button>
            </div>
            <!-- emmm, show created -->
            <el-dialog
                title="添加原料信息"
                :visible.sync="isShow"
                @close="handleClose"
                width="600px">
                <el-form label-position="right" label-width="80px" :model="formLabel">
                    <el-form-item label="退货公司">
                        <el-input v-model="formLabel.company"></el-input>
                    </el-form-item>
                    <el-form-item label="退货产品名称">
                        <el-input v-model="formLabel.name"></el-input>
                    </el-form-item>
                    <el-form-item label="退货件数">
                        <el-input v-model="formLabel.number"></el-input>
                    </el-form-item>
                    <el-form-item label="单价">
                        <el-input v-model="formLabel.price"></el-input>
                    </el-form-item>
                    <el-form-item label="退货原因">
                        <el-input v-model="formLabel.reason"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="isShow = false">取 消</el-button>
                    <el-button type="primary" @click="handleCreateReturn">确 定</el-button>
                </span>
            </el-dialog>
        </nav>
        <el-table
            :data="tableData"
            style="width: 100%">
            
            <el-table-column
                label="退货公司">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.Company }}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="Name"
                label="退货产品">
            </el-table-column>
            <el-table-column
                prop="Number"
                label="退货件数">
            </el-table-column>
            <el-table-column
                prop="Price"
                label="单价">
            </el-table-column>
            <el-table-column
                prop="Total"
                label="合计">
            </el-table-column>
            <el-table-column
                prop="Reason"
                label="退货原因">
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
                <el-form-item label="退货公司">
                    <el-input v-model="UpdataModel.company"></el-input>
                </el-form-item>
                <el-form-item label="退货产品名称">
                    <el-input v-model="UpdataModel.name"></el-input>
                </el-form-item>
                <el-form-item label="退货件数">
                    <el-input v-model="UpdataModel.number"></el-input>
                </el-form-item>
                <el-form-item label="单价">
                    <el-input v-model="UpdataModel.price"></el-input>
                </el-form-item>
                <el-form-item label="退货原因">
                    <el-input v-model="UpdataModel.reason"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isUpdata = false">取 消</el-button>
                <el-button type="primary" @click="handleUpdataReturn">确 定</el-button>
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
export default class Return extends Vue {
    @Provide() public isShow: boolean = false;
    @Provide() public isUpdata: boolean = false;
    @Provide() public returnSearchInput: string = "";
    @Provide() public formLabel: any = {
        company: "",
        name: '',
        number: '',
        price: "",
        reason: "",
        date: "",
    };
    @Provide() public UpdataModel: any = {
        id: "",
        name: '',
        company: "",
        number: '',
        price: "",
        total: "",
        reason: "",
    };
    @Provide() public tableData: any = [];

    // 搜索
    private async handleSearchReturn() {
        const response = await get("/return/list?name=" + this.returnSearchInput);
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
        this.formLabel.company = "";
        this.formLabel.number = "";
        this.formLabel.price = "";
        this.formLabel.total = "";
        this.formLabel.reason = "";
    }

    // 确定添加
    private async handleCreateReturn() {
        const data = {
            name: this.formLabel.name,
            company: this.formLabel.company,
            number: this.formLabel.number,
            price: this.formLabel.price,
            reason:  this.formLabel.reason,
        };
        const response = await post("/return/list", data);
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
        this.UpdataModel.company = row.Company;
        this.UpdataModel.id = row.id;
        this.UpdataModel.price = row.Price;
        this.UpdataModel.total = row.Total;
        this.UpdataModel.reason = row.Reason;
    }

    // 修改关闭
    private handleUpdataClose() {
        this.UpdataModel.name = "";
        this.UpdataModel.number = "";
        this.UpdataModel.company = "";
        this.UpdataModel.id = "";
        this.UpdataModel.price = "";
        this.UpdataModel.total = "";
        this.UpdataModel.reason = "";
    }

    // 修改确定
    private async handleUpdataReturn() {
        const response = await put("/return/list", this.UpdataModel);
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
        const response = await deletes("/return/list?id=" + row.id);
        if (response.data.code === "200") {
            this.$message.success("删除成功");
            this.initLoad();
        } else {
            this.$message.success(response.data.msg);
        }
    }

    private async initLoad() {
        const response = await get("/return/list");
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
