import { ISettingsFormData } from '@/app/[lng]/_interfaces/interfaces';
import { useState } from 'react';
import RequiredFieldAsterisk from './RequiredFieldAsterisk';
import { allSizes, Quality, Version } from '@/lib/utils';

const SettingsForm = ({
	initialValues,
	onSubmit,
}: {
	initialValues: ISettingsFormData;
	onSubmit: () => void;
}) => {
	const [series, setSeries] = useState<string>(initialValues.series ?? '');
	const [dm, setDm] = useState<string>(initialValues.dm ?? '');
	const [qualities, setQualities] = useState<Quality[]>(initialValues.qualities ?? []);
	const [version, setVersion] = useState<Version[]>(initialValues.version ?? []);
	const [v2Name, setV2Name] = useState<Version[]>(initialValues.v2Name ?? []);
	const [v2Qualities, setV2Qualities] = useState<Quality[]>(initialValues.v2Qualities ?? []);

	const [qualitiesName, setQualitiesName] = useState<string>('');
	const [qualitiesNum, setQualitiesNum] = useState<string>('');

	const [versionsName, setVersionsName] = useState<string>('');
	const [versionsNum, setVersionsNum] = useState<string>('');
	const [versionsNums, setVersionsNums] = useState<string[]>([]);

	const [v2NameName, setV2NameName] = useState<string>('');
	const [v2NameNum, setV2NameNum] = useState<string>('');
	const [v2NameNums, setV2NameNums] = useState<string[]>([]);

	const [v2QualitiesName, setV2QualitiesName] = useState<string>('');
	const [v2QualitiesNum, setV2QualitiesNum] = useState<string>('');

	const qualitiesTable = (
		<table className="border-collapse border border-gray-400 p-2">
			<thead>
				<tr>
					<th className="border border-gray-400 p-2">{`Name`}</th>
					<th className="border border-gray-400 p-2">{`Num`}</th>
					{qualities.length > 0 && <th className="border border-gray-400 p-2"></th>}
				</tr>
			</thead>
			<tbody>
				{qualities.length ? (
					qualities.map((item, idx) => (
						<tr key={`qualities-item-${idx}`}>
							<td className="border border-gray-400 p-2">{item.name}</td>
							<td className="border border-gray-400 p-2">{item.num}</td>
							<td className="border border-gray-400 p-2">
								<button
									type="button"
									className={`font-semibold text-red-700`}
									onClick={() => {
										setQualities((prev) => prev.filter((_, i) => i !== idx));
									}}
								>{`X`}</button>
							</td>
						</tr>
					))
				) : (
					<tr>
						<td
							colSpan={3}
							className="border border-gray-400 p-2 text-center"
						>{`No items found`}</td>
					</tr>
				)}
				<tr>
					<td className="border border-gray-400 p-2">
						<input
							className={`w-full rounded border border-gray-300 p-2`}
							type="text"
							name="qualitiesName"
							value={qualitiesName}
							placeholder={`Insert name`}
							onChange={(e) => setQualitiesName(e.currentTarget.value)}
							required
						/>
					</td>
					<td className="border border-gray-400 p-2">
						<input
							className={`w-full rounded border border-gray-300 p-2`}
							type="text"
							name="qualitiesNum"
							value={qualitiesNum}
							placeholder={`Insert num`}
							onChange={(e) => setQualitiesNum(e.currentTarget.value)}
							required
						/>
					</td>
					{qualities.length > 0 && <td className="border border-gray-400 p-2"></td>}
				</tr>
			</tbody>
		</table>
	);

	const versionsTable = (
		<table className="border-collapse border border-gray-400 p-2">
			<thead>
				<tr>
					<th className="border border-gray-400 p-2">{`Name`}</th>
					<th className="border border-gray-400 p-2">{`Num`}</th>
					{version.length > 0 && <th className="border border-gray-400 p-2"></th>}
				</tr>
			</thead>
			<tbody>
				{version.length ? (
					version.map((item, idx) => (
						<tr key={`version-item-${idx}`}>
							<td className="border border-gray-400 p-2">{item.name}</td>
							<td className="border border-gray-400 p-2">
								<div className={`flex-col space-x-2 space-y-2`}>
									{item.num.map((vn, numsIdx) => (
										<span
											key={`vn-item-${vn}-${numsIdx}`}
											className="rounded-xl border border-gray-400 px-2 py-1"
										>
											{vn}
										</span>
									))}
								</div>
							</td>
							<td className="border border-gray-400 p-2">
								<button
									type="button"
									className={`font-semibold text-red-700`}
									onClick={() => {
										setVersion((prev) => prev.filter((_, i) => i !== idx));
									}}
								>{`X`}</button>
							</td>
						</tr>
					))
				) : (
					<tr>
						<td
							colSpan={2}
							className="border border-gray-400 p-2 text-center"
						>{`No items found`}</td>
					</tr>
				)}
				<tr>
					<td className="border border-gray-400 p-2">
						<input
							className={`w-full rounded border border-gray-300 p-2`}
							type="text"
							name="versionsName"
							value={versionsName}
							placeholder={`Insert name`}
							onChange={(e) => setVersionsName(e.currentTarget.value)}
							required
						/>
					</td>
					<td className="border border-gray-400 p-2">
						<div className={`flex-col space-y-2`}>
							<div className={`flex-col space-x-2 space-y-2`}>
								{versionsNums.map((vn, numsIdx) => (
									<span
										key={`version-nums-item-${vn}-${numsIdx}`}
										className="rounded-xl border border-gray-400 px-2 py-1"
									>
										{vn}{' '}
										<button
											className={`font-semibold text-red-700`}
											title="Remove nums item"
											onClick={() =>
												setVersionsNums((prev) =>
													prev.filter((_, i) => i !== numsIdx)
												)
											}
										>
											{`X`}
										</button>
									</span>
								))}
							</div>
							<input
								className={`w-full rounded border border-gray-300 p-2`}
								type="text"
								name="versionsNum"
								value={versionsNum}
								placeholder={`Insert num`}
								onChange={(e) => setVersionsNum(e.currentTarget.value)}
								required
							/>
							<button
								type="button"
								className={`rounded-xl bg-gray-800 px-4 py-2 ${!versionsNum ? 'cursor-not-allowed text-gray-400' : 'text-white hover:cursor-pointer hover:opacity-90'} transition ease-in-out`}
								disabled={!versionsNum}
								onClick={() => {
									setVersionsNums((prev) => [...prev, versionsNum]);
									setVersionsNum('');
								}}
							>{`Add item`}</button>
						</div>
					</td>
					{version.length > 0 && <td className="border border-gray-400 p-2"></td>}
				</tr>
			</tbody>
		</table>
	);

	const v2NameTable = (
		<table className="border-collapse border border-gray-400 p-2">
			<thead>
				<tr>
					<th className="border border-gray-400 p-2">{`Name`}</th>
					<th className="border border-gray-400 p-2">{`Num`}</th>
					{v2Name.length > 0 && <th className="border border-gray-400 p-2"></th>}
				</tr>
			</thead>
			<tbody>
				{v2Name.length ? (
					v2Name.map((item, idx) => (
						<tr key={`v2Name-item-${idx}`}>
							<td className="border border-gray-400 p-2">{item.name}</td>
							<td className="border border-gray-400 p-2">
                                <div className={`flex-col space-x-2 space-y-2`}>
									{item.num.map((v2n, numsIdx) => (
										<span
											key={`v2n-item-${v2n}-${numsIdx}`}
											className="rounded-xl border border-gray-400 px-2 py-1"
										>
											{v2n}
										</span>
									))}
								</div>
                            </td>
							<td className="border border-gray-400 p-2">
								<button
									type="button"
									className={`font-semibold text-red-700`}
									onClick={() => {
										setV2Name((prev) => prev.filter((_, i) => i !== idx));
									}}
								>{`X`}</button>
							</td>
						</tr>
					))
				) : (
					<tr>
						<td
							colSpan={2}
							className="border border-gray-400 p-2 text-center"
						>{`No items found`}</td>
					</tr>
				)}
                <tr>
					<td className="border border-gray-400 p-2">
						<input
							className={`w-full rounded border border-gray-300 p-2`}
							type="text"
							name="v2NameName"
							value={v2NameName}
							placeholder={`Insert name`}
							onChange={(e) => setV2NameName(e.currentTarget.value)}
							required
						/>
					</td>
					<td className="border border-gray-400 p-2">
						<div className={`flex-col space-y-2`}>
							<div className={`flex-col space-x-2 space-y-2`}>
								{v2NameNums.map((v2n, numsIdx) => (
									<span
										key={`v2-name-nums-item-${v2n}-${numsIdx}`}
										className="rounded-xl border border-gray-400 px-2 py-1"
									>
										{v2n}{' '}
										<button
											className={`font-semibold text-red-700`}
											title="Remove nums item"
											onClick={() =>
												setV2NameNums((prev) =>
													prev.filter((_, i) => i !== numsIdx)
												)
											}
										>
											{`X`}
										</button>
									</span>
								))}
							</div>
							<input
								className={`w-full rounded border border-gray-300 p-2`}
								type="text"
								name="v2NameNum"
								value={v2NameNum}
								placeholder={`Insert num`}
								onChange={(e) => setV2NameNum(e.currentTarget.value)}
								required
							/>
							<button
								type="button"
								className={`rounded-xl bg-gray-800 px-4 py-2 ${!v2NameNum ? 'cursor-not-allowed text-gray-400' : 'text-white hover:cursor-pointer hover:opacity-90'} transition ease-in-out`}
								disabled={!v2NameNum}
								onClick={() => {
									setV2NameNums((prev) => [...prev, v2NameNum]);
									setV2NameNum('');
								}}
							>{`Add item`}</button>
						</div>
					</td>
					{v2Name.length > 0 && <td className="border border-gray-400 p-2"></td>}
				</tr>
			</tbody>
		</table>
	);

	const v2QualitiesTable = (
		<table className="border-collapse border border-gray-400 p-2">
			<thead>
				<tr>
					<th className="border border-gray-400 p-2">{`Name`}</th>
					<th className="border border-gray-400 p-2">{`Num`}</th>
					{v2Qualities.length > 0 && <th className="border border-gray-400 p-2"></th>}
				</tr>
			</thead>
			<tbody>
				{v2Qualities.length ? (
					v2Qualities.map((item, idx) => (
						<tr key={`v2Qualities-item-${idx}`}>
							<td className="border border-gray-400 p-2">{item.name}</td>
							<td className="border border-gray-400 p-2">{item.num}</td>
							<td className="border border-gray-400 p-2">
								<button
									type="button"
									className={`font-semibold text-red-700`}
									onClick={() => {
										setV2Qualities((prev) => prev.filter((_, i) => i !== idx));
									}}
								>{`X`}</button>
							</td>
						</tr>
					))
				) : (
					<tr>
						<td
							colSpan={3}
							className="border border-gray-400 p-2 text-center"
						>{`No items found`}</td>
					</tr>
				)}
				<tr>
					<td className="border border-gray-400 p-2">
						<input
							className={`w-full rounded border border-gray-300 p-2`}
							type="text"
							name="v2QualitiesName"
							value={v2QualitiesName}
							placeholder={`Insert name`}
							onChange={(e) => setV2QualitiesName(e.currentTarget.value)}
							required
						/>
					</td>
					<td className="border border-gray-400 p-2">
						<input
							className={`w-full rounded border border-gray-300 p-2`}
							type="text"
							name="v2QualitiesNum"
							value={v2QualitiesNum}
							placeholder={`Insert num`}
							onChange={(e) => setV2QualitiesNum(e.currentTarget.value)}
							required
						/>
					</td>
					{v2Qualities.length > 0 && <td className="border border-gray-400 p-2"></td>}
				</tr>
			</tbody>
		</table>
	);

	return (
		<>
			<div className={`flex-col space-y-2`}>
				<label className={`block font-semibold`} htmlFor="series">
					{`Series`} <RequiredFieldAsterisk />
				</label>
				<input
					className={`w-full rounded border border-gray-300 p-2`}
					type="text"
					name="series"
					value={series}
					placeholder={`Insert series`}
					onChange={(e) => setSeries(e.currentTarget.value)}
					required
				/>
			</div>
			<div className={`flex-col space-y-2`}>
				<label className={`block font-semibold`} htmlFor="dm">{`DN`}</label>
				<select
					className={`w-full rounded border border-gray-300 p-2`}
					name="dm"
					value={dm}
					onChange={(e) => setDm(e.target.value)}
				>
					<option value="">Select DN</option>
					{allSizes.map((size, idx) => (
						<option key={`${size}-${idx}`} value={size}>
							{size}
						</option>
					))}
				</select>
			</div>
			<div className={`flex-col space-y-2`}>
				<label className={`block font-semibold`} htmlFor="qualities">{`Qualities`}</label>
				{qualitiesTable}
				<button
					type="button"
					className={`rounded-xl bg-gray-800 px-4 py-2 ${!qualitiesName || !qualitiesNum ? 'cursor-not-allowed text-gray-400' : 'text-white hover:cursor-pointer hover:opacity-90'} transition ease-in-out`}
					disabled={!qualitiesName || !qualitiesNum}
					onClick={() => {
						setQualities((prev) => [
							...prev,
							{ name: qualitiesName, num: qualitiesNum },
						]);
						setQualitiesName('');
						setQualitiesNum('');
					}}
				>{`Add item`}</button>
			</div>
			<hr />
			<div className={`flex-col space-y-2`}>
				<label className={`block font-semibold`} htmlFor="version">{`Versions`}</label>
				{versionsTable}
				<button
					type="button"
					className={`rounded-xl bg-gray-800 px-4 py-2 ${!versionsName || versionsNums.length === 0 ? 'cursor-not-allowed text-gray-400' : 'text-white hover:cursor-pointer hover:opacity-90'} transition ease-in-out`}
					disabled={!versionsName || versionsNums.length === 0}
					onClick={() => {
						setVersion((prev) => [...prev, { name: versionsName, num: versionsNums }]);
						setVersionsName('');
						setVersionsNums([]);
					}}
				>{`Add item`}</button>
			</div>
			<hr />
			<div className={`flex-col space-y-2`}>
				<label className={`block font-semibold`} htmlFor="v2Name">{`v2 Names`}</label>
				{v2NameTable}
				<button
					type="button"
					className={`rounded-xl bg-gray-800 px-4 py-2 ${!v2NameName || v2NameNums.length === 0 ? 'cursor-not-allowed text-gray-400' : 'text-white hover:cursor-pointer hover:opacity-90'} transition ease-in-out`}
					disabled={!v2NameName || v2NameNums.length === 0}
					onClick={() => {
						setV2Name((prev) => [...prev, { name: v2NameName, num: v2NameNums }]);
						setV2NameName('');
						setV2NameNums([]);
					}}
				>{`Add item`}</button>
			</div>
			<hr />
			<div className={`flex-col space-y-2`}>
				<label
					className={`block font-semibold`}
					htmlFor="v2Qualities"
				>{`v2 Qualities`}</label>
				{v2QualitiesTable}
				<button
					type="button"
					className={`rounded-xl bg-gray-800 px-4 py-2 ${!v2QualitiesName || !v2QualitiesNum ? 'cursor-not-allowed text-gray-400' : 'text-white hover:cursor-pointer hover:opacity-90'} transition ease-in-out`}
					disabled={!v2QualitiesName || !v2QualitiesNum}
					onClick={() => {
						setV2Qualities((prev) => [
							...prev,
							{ name: v2QualitiesName, num: v2QualitiesNum },
						]);
						setV2QualitiesName('');
						setV2QualitiesNum('');
					}}
				>{`Add item`}</button>
			</div>
		</>
	);
};

export default SettingsForm;
