'use client';

import PostForm from '@/app/dashboard/_components/PostForm';
import { FailedResponse, IPostFormData, SimpleResponse } from '@/app/[lng]/_interfaces/interfaces';
import { IPost, postsService } from '@/app/[lng]/_services/posts';
import { useLang } from '@/app/dashboard/_context/LangContext';
import { useRouter } from 'next/navigation';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { dataUrlToFile, getErrorMessage } from '@/app/[lng]/_services/utils';

export default function EditPost({ params }: { params: { post: string } }) {
	const { post: pId } = params;

	const emptyPostValue = {
		name: '',
		description: '',
		keywords: '',
		content: '',
		isFeatured: false,
		image: null,
		alt: '',
		categories: [],
		tags: [],
	};

	const [fetchedPost, setFetchedPost] = useState<IPost | null>(null);
	const [fetchedImage, setFetchedImage] = useState<File | null>(null);
	const [postForm, setPostForm] = useState<IPostFormData>(emptyPostValue);
	const [isLoadingForm, setIsLoading] = useState<boolean>(false);
	const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false);

	const router = useRouter();

	const { lang } = useLang();

	const handleError = (error: any) => {
		const errorResult = error as SimpleResponse;
		if ((!errorResult.isSuccessful && errorResult.isFailed) || (error as FailedResponse).errors?.length) {
			if (typeof error === 'string') {
				alert(error);
			} else {
				alert(getErrorMessage(error as FailedResponse));
			}
		} else {
			router.push(`/dashboard/posts/view/${pId}`);
		}
	};

	const submitForm = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			setIsSubmittingForm(true);
			try {
				const result = await postsService.editPost(
					pId,
					postForm.name,
					postForm.description,
					postForm.keywords,
					postForm.content,
					postForm.isFeatured,
					postForm.image,
					postForm.alt,
					[],
					[],
					lang
				);
				if ((result as FailedResponse).status > 200) {
					handleError(result);
				} else {
					setIsSubmittingForm(false);
					router.push(`/dashboard/posts/view/${pId}`);
				}
			} catch (error) {
				handleError(error);
				setIsSubmittingForm(false);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			pId,
			postForm.name,
			postForm.description,
			postForm.keywords,
			postForm.content,
			postForm.isFeatured,
			postForm.image,
			postForm.alt,
			lang,
		]
	);

	const handleFormChange = (form: IPostFormData) => {
		setPostForm(form);
	};

	useEffect(() => {
		const fetchPost = async () => {
			setIsLoading(true);
			try {
				const post = await postsService.getPost(params.post, lang);
				if (post.data.dataImage) {
					setFetchedImage(await dataUrlToFile(post.data.dataImage, ''));
				}
				setFetchedPost(post.data);
				setIsLoading(false);
			} catch (error) {
				setIsLoading(false);
			}
		};
		setPostForm(emptyPostValue);
		fetchPost();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params.post, lang]);

	return (
		<div>
			<h2 className="my-5 text-2xl font-semibold">{`Edit Post`}</h2>
			{fetchedPost ? (
				<form className={`flex-col space-y-3`} onSubmit={submitForm}>
					<PostForm
						initialValues={{
							name: fetchedPost?.name ?? '',
							description: fetchedPost?.description ?? '',
							keywords: fetchedPost?.keywords ?? '',
							content: fetchedPost?.content ?? '',
							isFeatured: fetchedPost?.isFeatured ?? false,
							image: fetchedImage,
							alt: fetchedPost?.alt ?? '',
							categories: [],
							tags: [],
						}}
						handleFormChange={handleFormChange}
					/>
					<hr />
					<button
						className={`border-5 rounded-xl border px-4 py-2 ${!isSubmittingForm ? 'border-gray-800 text-gray-800 hover:cursor-pointer hover:bg-gray-800 hover:text-white hover:opacity-90' : 'border-gray-600 text-gray-600'} transition ease-in-out`}
						type="submit"
						disabled={isSubmittingForm}
					>
						Edit Post
					</button>
				</form>
			) : null}
		</div>
	);
}
