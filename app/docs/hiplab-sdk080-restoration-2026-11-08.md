# HipLab UI 与 SDK v0.8.0 整合恢复

2026-11-08，用户指出+25首页恢复了旧左侧计划键和右侧更多键。原因不是已认可UI被删除，而是+25严格从SDK分支指定提交9d35b11构建，该分支不包含此前UI分支及本机后续改动；出包前没有将产品UI基线与SDK任务基线核对清楚。交付说明应更早明确这个差异。

## 原成果与整合来源

- 原UI工作树 `E:/AII-3D/3D-Body-worktrees/hiplab-r3-pool-20261107`，HEAD1cd4dd2及本机改动原样保留，20项运行源指纹与vc2034性能预览回执全部一致；没有reset、clean、覆盖或删除原成果。
- 新独立分支 `codex/hiplab-sdk080-restore-20261108`，基于9d35b11带入实际UI工作树差异，包括未跟踪文件、图标、28个本地化文件、40张补齐封面及测试。原WIP二进制补丁与未跟踪文件副本、逐文件哈希保存在本工作树 `output/ui-sdk080-restore-20261108/original-ui-wip/` 和integration-manifest.json。
- 保留9d35b11的trainer_page目录语音接入、trainer_voice带lang的适配、536b4c52 SDK锁文件；pubspec仅版本从+25改为+26。没有复制旧SDK配置回去，也未修改SDK源码、Pose-Hub或iOS。
- 保留新版首页左侧圆形对称菜单并打开底部菜单、右侧按钮移除、Hip导航与返回胶囊、菜单/设置行及浅深图标、249动作库与AI范围、同行等高、文案测高缓存、静态海报及40张补齐封面。两份目录/热更新实现与9d35b11本来相同，不按Git未跟踪状态误删。

## 检查与保存

整合后pub get成功，SDK仍全部536b4c52、ugk_coach0.8.0；分析No issues found，token owner外仍color=8/font=0/radius=5/height50=0，无新增。首轮全量405通过/1跳过/5失败，其中4项是已知SDK ar/hi大字问题；另一项records_page_test通过旧Icon finder定位自绘加号而失败，尚未进入picker业务断言。仅改用已有routine-add稳定键，三项records测试通过，原添加/已加入/编号断言不变。

最终全量406通过/1项opt-in跳过/仅4项已知SDK ar/hi大字号失败，首页菜单到249动作库的真实流程测试通过，没有其它失败。源码会在该统一分支本地保存；APK与真机身份在本轮结束时补充到回执。尚未推送远端、未合master/任何PR、未打tag或发布。
