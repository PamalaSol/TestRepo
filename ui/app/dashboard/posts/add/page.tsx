'use client';

import PostForm from '../../_components/PostForm';
import { FailedResponse, IPostFormData } from '@/app/[lng]/_interfaces/interfaces';
import { postsService } from '@/app/[lng]/_services/posts';
import { useRouter } from 'next/navigation';
import { FormEvent, useCallback, useState } from 'react';
import { useLang } from '../../_context/LangContext';
import { getErrorMessage } from '@/app/[lng]/_services/utils';

export default function AddPost() {
	const defaultEmptyPost: IPostFormData = {
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

	const [postForm, setPostForm] = useState<IPostFormData>(defaultEmptyPost);
	const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false);

	const router = useRouter();

	const { lang } = useLang();

	const submitForm = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			if (!postForm.name) {
				alert('Name is missing!');
				return;
			}
			if (!postForm.content) {
				alert('Content is missing!');
				return;
			}
			setIsSubmittingForm(true);
			try {
				await postsService.addPost(
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
				setIsSubmittingForm(false);
				router.push('/dashboard/posts');
			} catch (error) {
				alert(getErrorMessage(error as FailedResponse));
				setIsSubmittingForm(false);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
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

	return (
		<div>
			<h2 className={`my-5 text-2xl font-semibold`}>{`Add Post`}</h2>

			<p className="mb-4 w-full text-center font-semibold">
				If you&apos;re adding a new post, the post information must be in German.
			</p>

			<form className={`flex-col space-y-3`} onSubmit={submitForm}>
				<PostForm initialValues={defaultEmptyPost} handleFormChange={handleFormChange} />
				<hr />
				<button
					className={`border-5 rounded-xl border px-4 py-2 ${!isSubmittingForm ? 'border-gray-800 text-gray-800 hover:cursor-pointer hover:bg-gray-800 hover:text-white hover:opacity-90' : 'border-gray-600 text-gray-600'} transition ease-in-out`}
					type="submit"
					disabled={isSubmittingForm}
				>
					Add Post
				</button>
			</form>
		</div>
	);
}
