//#region src/ssr/ssr-match-id.ts
function dehydrateSsrMatchId(id) {
	return id.replaceAll("/", "#");
}
//#endregion
exports.dehydrateSsrMatchId = dehydrateSsrMatchId;

//# sourceMappingURL=ssr-match-id.cjs.map