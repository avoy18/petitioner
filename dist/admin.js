function o(){import.meta.url,import("_").catch(()=>1),async function*(){}().next()}class n{constructor(){this.total=0,this.perPage=1e3,this.tableDiv=document.getElementById("petitioner_submissions"),this.entriesDiv=this.tableDiv.querySelector(".petitioner-admin__entries"),this.paginationDiv=this.tableDiv.querySelector(".petitioner-admin__pagination"),this.currentPage=1,this.formSettings={},this.handleFormSettings(),this.formSettings.formID&&(this.fetch_data(this.currentPage),this.paginationDiv.addEventListener("click",e=>{if(e.target.classList.contains("petitioner__paging-button")){e.preventDefault();const i=parseInt(e.target.dataset.page);this.fetch_data(i)}}))}handleFormSettings(){const e=this.tableDiv.dataset.petitionerSubmissions;this.formSettings=JSON.parse(e)}fetch_data(e){const i="".concat(ajaxurl,"?action=petitioner_fetch_submissions&page=").concat(e,"&form_id=").concat(this.formSettings.formID,"&per_page=").concat(this.perPage);console.log(i),fetch(i).then(t=>t.json()).then(t=>{const{success:a,data:s}=t;a&&(this.total=s.total,this.submissions=s.submissions,this.render_table())}).catch(t=>console.error("Error fetching data:",t))}render_table(){var i;const e=(i=this.submissions)==null?void 0:i.map(t=>"<tr>\n                        <td>".concat(t.email,"</td>\n                        <td>").concat(t.fname,"</td>\n                        <td>").concat(t.lname,"</td>\n                        <td>").concat(t.bcc_yourself?"yes":"no","</td>\n                        <td>").concat(t.submitted_at,"</td>\n                    </tr>")).join("");this.entriesDiv.innerHTML="\n        <p>Total: ".concat(this.total,'</p>\n        <table class="wp-list-table widefat fixed striped table-view-list posts">\n            <thead>\n                <tr>\n                    <th>Email</th>\n                    <th>First name</th>\n                    <th>Last name</th>\n                    <th>BCC</th>\n                    <th>Submitted at</th>\n                </tr>\n            </thead>\n            <tbody>\n                ').concat(e,"\n            </tbody>\n        </table>\n        ")}}new n;export{o as __vite_legacy_guard};
