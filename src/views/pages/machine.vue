<template>
    <div class="warehouse">
        <nav class="product-top">
            <el-button type="primary" @click="handleCreateBtn">机器工人记工</el-button>
            <div class="top-serarch">
                <el-input class="search-input" v-model="machineSearchInput" placeholder="输入格式 名字/时间..."></el-input>
                <el-button type="primary" @click="handleSearchMachine">搜索</el-button>
            </div>
            <!-- emmm, show created -->
            <el-dialog
                title="添加原料信息"
                :visible.sync="isShow"
                @close="handleClose"
                width="30%">
                <el-form label-position="right" label-width="80px" :model="formLabel">
                    <el-form-item label="年份">
                        <el-input :disabled="true" v-model="formLabel.now"></el-input>
                    </el-form-item>
                    <el-form-item label="工人">
                        <el-input v-model="formLabel.name"></el-input>
                    </el-form-item>
                    <el-form-item label="记工时长">
                        <el-select v-model="formLabel.time" clearable placeholder="请选择">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="isShow = false">取 消</el-button>
                    <el-button type="primary" @click="handleCreateMachine">确 定</el-button>
                </span>
            </el-dialog>
        </nav>
        <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
                label="工人">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.Name }}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="Time"
                label="记工时长">
            </el-table-column>
            <el-table-column
                prop="Now"
                label="年份">
            </el-table-column>
            <el-table-column
                prop="Date"
                label="记工的时间">
            </el-table-column>
        </el-table>
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
    @Provide() public machineSearchInput: string = "";
    @Provide() public formLabel: any = {
        name: '',
        time: '',
        now: "",
    };
    @Provide() public tableData: any = [];
    @Provide() public options: any = [
        {
            value: '1.0',
            label: '一天',
        },
        {
            value: '0.5',
            label: '半天',
        },
    ];

    // 记工按钮
    private handleCreateBtn() {
        this.isShow = true;
        const date = new Date();
        const year = date.getFullYear();
        this.formLabel.now = year;
    }

    // 搜索
    private async handleSearchMachine() {
        const input = this.machineSearchInput.split("/");
        const data = {
            name: input[0],
            now: input[1] === undefined ? "" : input[1],
        };
        const response = await get("/machine/list?name=" + data.name + "&now=" + data.now);
        if (response.data.code === "200") {
            for (const item of response.data.data) {
                item.Date = item.Date.split("T")[0];
                item.Time = item.Time === "1.0" ? "一天" : "半天";
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
        this.formLabel.time = "";
        this.formLabel.now = "";
    }

    // 确定添加
    private async handleCreateMachine() {
        const data = {
            name: this.formLabel.name,
            time: this.formLabel.time,
            now: this.formLabel.now,
        };
        const response = await post("/machine/list", data);
        if (response.data.code === "200") {
            this.$message.success("添加成功");
            this.isShow = false;
            this.initLoad();
        } else {
            this.$message.info("添加失败");
        }
        this.handleClose();
    }

    private async initLoad() {
        const response = await get("/machine/list");
        if (response.data.code === "200") {
            for (const item of response.data.data) {
                item.Date = item.Date.split("T")[0];
                item.Time = item.Time === "1.0" ? "一天" : "半天";
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
